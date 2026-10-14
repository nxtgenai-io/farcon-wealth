/**
 * Farcon Leads — Google Apps Script web app.
 * Spreadsheet: Farcon Leads
 * ID: 1uUn5ZLBny1_0A4tiPTdZv0CShnlq5K8IbKsloA-FGKc
 *
 * Paste this file into Extensions → Apps Script on that spreadsheet,
 * then deploy as a Web app (see README). The Worker POSTs JSON here.
 * Timestamp is the script clock. Status defaults to "New".
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
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
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

function doGet() {
  return json({ ok: true, service: 'Farcon Leads webhook' });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ ok: false, error: 'Missing JSON body.' });
    }
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      text(data.form),
      text(data.name),
      text(data.email),
      text(data.phone),
      text(data.city),
      text(data.goal),
      text(data.investmentType),
      text(data.amount),
      text(data.timeHorizon),
      text(data.riskProfile),
      text(data.message),
      text(data.sourcePage),
      'New',
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
