import React, { useState } from 'react';
import { leadService } from '@/lib/api/leadService';
import { isIndianMobile } from '@/lib/phone';

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
  message: string;
  companyWebsite: string;
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
  message: '',
  companyWebsite: '',
};

interface LeadFormProps {
  form: string;
  submitLabel: string;
  requireMessage?: boolean;
  showPreferences?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ form, submitLabel, requireMessage = false, showPreferences = false }) => {
  const [values, setValues] = useState<LeadFormValues>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [statusKind, setStatusKind] = useState<'idle' | 'ok' | 'err'>('idle');
  const [busy, setBusy] = useState(false);

  const set = (key: keyof LeadFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Enter a valid email.';
    if (!isIndianMobile(values.phone)) next.phone = 'Enter a 10-digit Indian mobile number.';
    if (values.city.trim().length < 2) next.city = 'Enter your city.';
    if (requireMessage && values.message.trim().length < 8) next.message = 'Tell us a little more.';
    if (showPreferences && !values.goal) next.goal = 'Choose a goal.';
    setErrors(next);
    if (Object.keys(next).length) {
      setStatusKind('err');
      setStatus('Please correct the highlighted fields.');
      return;
    }
    if (values.companyWebsite.trim()) {
      setStatusKind('ok');
      setStatus('Thank you. We have your note.');
      setValues(empty);
      return;
    }

    setBusy(true);
    setStatus('');
    setStatusKind('idle');
    try {
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
        message: values.message,
        sourcePage: window.location.pathname,
        companyWebsite: values.companyWebsite,
      });
      if (!result.success) {
        setStatusKind('err');
        setStatus(result.message);
        return;
      }
      setStatusKind('ok');
      setStatus(result.message);
      setValues(empty);
    } catch {
      setStatusKind('err');
      setStatus('We could not send this just now. Please try again or use WhatsApp.');
    } finally {
      setBusy(false);
    }
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
      <label className="field"><span className={showPreferences ? 'req' : undefined}>Goal</span>
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
          <label className="field">Investment Type
            <select value={values.investmentType} onChange={set('investmentType')}>
              <option value="">Select</option>
              <option>SIP</option>
              <option>Lumpsum</option>
              <option>SIP and Lumpsum</option>
            </select>
          </label>
          <label className="field">Amount<input value={values.amount} onChange={set('amount')} placeholder="₹25,000 a month" /></label>
          <label className="field">Time Horizon
            <select value={values.timeHorizon} onChange={set('timeHorizon')}>
              <option value="">Select</option>
              <option>Under 3 years</option>
              <option>3–5 years</option>
              <option>5–10 years</option>
              <option>10+ years</option>
            </select>
          </label>
          <label className="field">Risk Profile
            <select value={values.riskProfile} onChange={set('riskProfile')}>
              <option value="">Select</option>
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </label>
        </>
      )}
      <label className="field"><span className={requireMessage ? 'req' : undefined}>Message</span><textarea value={values.message} onChange={set('message')} placeholder="What would you like to talk about?" />{errors.message && <span className="err">{errors.message}</span>}</label>
      <p className="hf-note">By sending this, you agree we may reply about this enquiry. See the privacy policy for how a note is stored.</p>
      <button className="hf-btn hf-btn-green" type="submit" disabled={busy} aria-busy={busy}>{busy ? 'Sending…' : submitLabel}</button>
      {status && <p className="hf-note" role={statusKind === 'err' ? 'alert' : 'status'}>{status}</p>}
    </form>
  );
};
