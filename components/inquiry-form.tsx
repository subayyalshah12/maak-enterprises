'use client';

import { useState } from 'react';
import { getDivisionWhatsAppUrl } from '@/lib/whatsapp';

type SubmissionState = 'idle' | 'sending' | 'success' | 'error';

export function InquiryForm({
  division = 'general',
  propertyId,
  title = 'Send an enquiry',
}: {
  division?: string;
  propertyId?: string;
  title?: string;
}) {
  const [state, setState] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState('');
  const [whatsAppUrl, setWhatsAppUrl] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState('sending');
    setMessage('');
    setWhatsAppUrl(null);
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const phone = String(data.get('phone') || '');
    const enquiry = String(data.get('message') || '');
    const payload = {
      name,
      email: String(data.get('email') || ''),
      phone,
      division,
      property_id: propertyId ?? null,
      message: enquiry,
      consent: data.get('consent') === 'on',
      source: 'website',
      website: String(data.get('website') || ''),
    };

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to send enquiry.');
      const whatsapp = getDivisionWhatsAppUrl(
        division,
        `Hello MAAK Enterprises, I have submitted an enquiry. Name: ${name}. Phone: ${phone}. Enquiry: ${enquiry}`,
      );
      form.reset();
      setWhatsAppUrl(whatsapp);
      setState('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
      setState('error');
    }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-heading">
        <p className="eyebrow">MAAK ENTERPRISES</p>
        <h3>{title}</h3>
      </div>
      <div className="form-grid">
        <label>Full name<input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
        <label>Email address<input name="email" type="email" maxLength={254} autoComplete="email" /></label>
        <label>Phone number<input name="phone" required minLength={7} maxLength={40} autoComplete="tel" /></label>
        <label>Division<input value={division.replaceAll('-', ' ')} disabled aria-label="Selected division" /></label>
      </div>
      <label>How can we help?<textarea name="message" required minLength={3} maxLength={5000} rows={5} /></label>
      <label className="consent">
        <input type="checkbox" name="consent" required />
        I agree that MAAK Enterprises may contact me about this enquiry.
      </label>
      <div className="form-honeypot" aria-hidden="true">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button className="button" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Submit enquiry'}
      </button>
      {state === 'success' && (
        <div className="success-message" role="status">
          <p>Thank you. Your enquiry has been received.</p>
          {whatsAppUrl && (
            <a className="button button-outline" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
              Continue with the relevant MAAK division on WhatsApp
            </a>
          )}
        </div>
      )}
      {state === 'error' && <p className="error-message" role="alert">{message}</p>}
    </form>
  );
}
