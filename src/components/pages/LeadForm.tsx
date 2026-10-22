import React, { useState } from 'react';
import { leadService } from '@/lib/api/leadService';
import { isIndianMobile } from '@/lib/phone';
import { FARCON_CONFIG } from '@/content/site/config';

export interface LeadFormValues {
  name: string;
  email: string;
  phone: string;
  city: string;
  goal: string;
  investmentType: string;
  amount: string;
  timeHorizon: string;
  riskProfile: string;
  contactPreference: string;
  message: string;
  companyWebsite: string;
  consent: boolean;
}

const empty: LeadFormValues = {
  name: '',
  email: '',
  phone: '',
  city: '',
  goal: '',
  investmentType: '',
  amount: '',
  timeHorizon: '',
  riskProfile: '',
  contactPreference: '',
  message: '',
  companyWebsite: '',
  consent: false,
};

interface LeadFormProps {
  form: string;
  submitLabel: string;
  requireMessage?: boolean;
  showPreferences?: boolean;
  requireGoal?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ form, submitLabel, requireMessage = false, showPreferences = false, requireGoal = false }) => {
  const [values, setValues] = useState<LeadFormValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState<'idle' | 'ok' | 'err'>('idle');
  const [busy, setBusy] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const whatsapp = `https://wa.me/${FARCON_CONFIG.whatsappNumber}`;

  const set = (key: keyof LeadFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === 'checkbox' ? (event.target as HTMLInputElement).checked : event.target.value;
    setValues((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Enter a valid email.';
    if (!isIndianMobile(values.phone)) next.phone = 'Enter a 10-digit Indian mobile number.';
    if (values.city.trim().length < 2) next.city = 'Enter your city.';
    if ((showPreferences || requireGoal) && !values.goal) next.goal = 'Choose a goal.';
    if (showPreferences && !values.amount.trim()) next.amount = 'Enter an amount or a monthly SIP.';
    if (showPreferences && !values.timeHorizon) next.timeHorizon = 'Choose a horizon.';
    if (showPreferences && !values.riskProfile) next.riskProfile = 'Choose a risk comfort.';
    if (!values.contactPreference) next.contactPreference = 'Choose WhatsApp, email or a call.';
    if (requireMessage && values.message.trim().length < 8) next.message = 'Tell us a little more.';
    if (!values.consent) next.consent = 'Tick the box so we may store this enquiry.';
    setErrors(next);
    if (Object.keys(next).length) {
      setStatusKind('err');
      setStatus('Please correct the highlighted fields.');
      return;
    }

    setBusy(true);
    setStatus('');
    setStatusKind('idle');
    const result = await leadService.submitSheetLead({
      form,
      name: values.name,
      email: values.email,
      phone: values.phone,
      city: values.city,
      goal: values.goal,
      investmentType: values.investmentType,
      amount: values.amount,
      timeHorizon: values.timeHorizon,
      riskProfile: values.riskProfile,
      contactPreference: values.contactPreference,
      message: values.message,
      sourcePage: window.location.pathname,
      companyWebsite: values.companyWebsite,
      consent: values.consent,
      formStartedAt: startedAt,
    });
    setBusy(false);
    if (!result.success) {
      setStatusKind('err');
      setStatus(result.message);
      return;
    }
    setStatusKind('ok');
    setStatus(result.leadId ? `${result.message} Reference ${result.leadId}.` : result.message);
    setValues(empty);
  };

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <label className="hp" aria-hidden="true">
        Website
        <input tabIndex={-1} autoComplete="off" value={values.companyWebsite} onChange={set('companyWebsite')} />
      </label>
      <label className="field"><span className="req">Name</span><input value={values.name} onChange={set('name')} autoComplete="name" placeholder="Your name" required />{errors.name && <span className="err">{errors.name}</span>}</label>
      <label className="field"><span className="req">Email</span><input type="email" value={values.email} onChange={set('email')} autoComplete="email" placeholder="you@email.com" required />{errors.email && <span className="err">{errors.email}</span>}</label>
      <label className="field"><span className="req">Phone</span><input inputMode="tel" value={values.phone} onChange={set('phone')} autoComplete="tel" placeholder="10-digit mobile" required />{errors.phone && <span className="err">{errors.phone}</span>}</label>
      <label className="field"><span className="req">City</span><input value={values.city} onChange={set('city')} autoComplete="address-level2" placeholder="Patna" required />{errors.city && <span className="err">{errors.city}</span>}</label>
      <label className="field"><span className={showPreferences || requireGoal ? 'req' : undefined}>Goal</span>
        <select value={values.goal} onChange={set('goal')}>
          <option value="">Select a goal</option>
          {['Retirement', 'Child Education', 'Wealth Creation', 'Tax Saving', 'Portfolio Review', 'Something else'].map((goal) => (
            <option key={goal}>{goal}</option>
          ))}
        </select>
        {errors.goal && <span className="err">{errors.goal}</span>}
      </label>
      {showPreferences && (
        <>
          <label className="field">Investment type
            <select value={values.investmentType} onChange={set('investmentType')}>
              <option value="">Select</option>
              <option>SIP</option>
              <option>Lumpsum</option>
              <option>SIP and Lumpsum</option>
            </select>
          </label>
          <label className="field"><span className="req">Amount or monthly SIP</span><input value={values.amount} onChange={set('amount')} placeholder="₹25,000 a month" />{errors.amount && <span className="err">{errors.amount}</span>}</label>
          <label className="field"><span className="req">Time horizon</span>
            <select value={values.timeHorizon} onChange={set('timeHorizon')}>
              <option value="">Select</option>
              <option>Under 3 years</option>
              <option>3–5 years</option>
              <option>5–10 years</option>
              <option>10+ years</option>
            </select>
            {errors.timeHorizon && <span className="err">{errors.timeHorizon}</span>}
          </label>
          <label className="field"><span className="req">Risk comfort</span>
            <select value={values.riskProfile} onChange={set('riskProfile')}>
              <option value="">Select</option>
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
            {errors.riskProfile && <span className="err">{errors.riskProfile}</span>}
          </label>
        </>
      )}
      <label className="field"><span className="req">How should we reply?</span>
        <select value={values.contactPreference} onChange={set('contactPreference')}>
          <option value="">Select</option>
          <option>WhatsApp</option>
          <option>Email</option>
          <option>Call</option>
        </select>
        {errors.contactPreference && <span className="err">{errors.contactPreference}</span>}
      </label>
      <label className="field"><span className={requireMessage ? 'req' : undefined}>Message</span><textarea value={values.message} onChange={set('message')} placeholder="What would you like to talk about?" />{errors.message && <span className="err">{errors.message}</span>}</label>
      <label className="field consent-row">
        <input type="checkbox" checked={values.consent} onChange={set('consent')} />
        <span>I agree Farcon Wealth may store this enquiry and reply about it. Read the <a href="/privacy">privacy policy</a>.</span>
      </label>
      {errors.consent && <span className="err">{errors.consent}</span>}
      <button className="hf-btn hf-btn-green" type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Sending…' : submitLabel}</button>
      {status && <p className="hf-note" role={statusKind === 'err' ? 'alert' : 'status'}>{status}</p>}
      {statusKind === 'err' && <a className="hf-btn hf-btn-outline" href={whatsapp} target="_blank" rel="noreferrer">Message us on WhatsApp</a>}
    </form>
  );
};
