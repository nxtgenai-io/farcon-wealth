/**
 * Farcon Leads — Google Apps Script web app.
 * Spreadsheet: Farcon Leads
 * ID: 1uUn5ZLBny1_0A4tiPTdZv0CShnlq5K8IbKsloA-FGKc
 * Tab: Farcon Leads (14 headers, already in row 1)
 *
 * Script property LEADS_SECRET must match the worker secret of the same name.
 * Deploy steps are in apps-script/README.md.
 */

var SHEET_ID = '1uUn5ZLBny1_0A4tiPTdZv0CShnlq5K8IbKsloA-FGKc';
var SHEET_NAME = 'Farcon Leads';
var HEADERS = [
  'Timestamp',
  'Form',
  'Name',
  'Email',
  'Phone',
  'City',
  'Goal',
  'Investment Type',
  'Amount',
  'Time Horizon',
  'Risk Profile',
  'Message',
  'Source Page',
  'Status',
];

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function text(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/[<>]/g, '').trim();
}

function cell(value) {
  var cleaned = text(value);
  if (/^[=+\-@]/.test(cleaned)) return "'" + cleaned;
  return cleaned;
}

function digits(value) {
  return text(value).replace(/\D/g, '');
}

function headerSecret(e) {
  var headers = (e && e.headers) || {};
  return text(headers['X-Leads-Secret'] || headers['x-leads-secret'] || '');
}

function doGet() {
  return json({ ok: true, service: 'Farcon Leads webhook' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Missing JSON body.' });
    }
    var data = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty('LEADS_SECRET') || '';
    var provided = text(data.secret) || headerSecret(e);
    if (!expected || provided !== expected) {
      return json({ ok: false, error: 'Unauthorised.' });
    }

    var sheet = getSheet();
    var phone = digits(data.phone);
    var email = text(data.email).toLowerCase();
    var leadId = text(data.leadId) || ('LEAD-' + new Date().getTime().toString(36).toUpperCase());
    var now = Date.now();
    var last = sheet.getLastRow();
    if (last >= 2 && (phone || email)) {
      var start = Math.max(2, last - 499);
      var height = last - start + 1;
      var rows = sheet.getRange(start, 1, height, HEADERS.length).getValues();
      for (var i = rows.length - 1; i >= 0; i--) {
        var stamp = rows[i][0] instanceof Date ? rows[i][0].getTime() : Date.parse(rows[i][0]);
        if (!stamp || now - stamp > 24 * 60 * 60 * 1000) continue;
        var samePhone = phone && digits(rows[i][4]) === phone;
        var sameEmail = email && text(rows[i][3]).toLowerCase() === email;
        if (!samePhone && !sameEmail) continue;
        var row = start + i;
        sheet.getRange(row, 1, 1, HEADERS.length).setValues([rowValues(data, leadId, 'Updated')]);
        return json({ ok: true, duplicate: true, leadId: leadId });
      }
    }
    sheet.appendRow(rowValues(data, leadId, 'New'));
    return json({ ok: true, duplicate: false, leadId: leadId });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function rowValues(data, leadId, status) {
  var when = text(data.consentAt) ? new Date(data.consentAt) : new Date();
  if (isNaN(when.getTime())) when = new Date();
  return [
    when,
    cell(data.form),
    cell(data.name),
    cell(data.email).toLowerCase(),
    cell(data.phone),
    cell(data.city),
    cell(data.goal),
    cell(data.investmentType),
    cell(data.amount),
    cell(data.timeHorizon),
    cell(data.riskProfile),
    cell(data.message || ('Lead ID: ' + leadId)),
    cell(data.sourcePage),
    status,
  ];
}
