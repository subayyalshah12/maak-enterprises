'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const maxBytes = 10 * 1024 * 1024;

export function ImageUploadField({
  name,
  initialUrls = [],
  folder = 'property-media',
}: {
  name: string;
  initialUrls?: string[];
  folder?: string;
}) {
  const [urls, setUrls] = useState(initialUrls);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (!isSupabaseConfigured) {
      setMessage('Supabase is not configured. You can add approved image URLs manually for local UI work.');
      event.target.value = '';
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of files) {
        if (!allowed.includes(file.type)) throw new Error('Use JPG, PNG, WebP or AVIF images only.');
        if (file.size > maxBytes) throw new Error('Each image must be 10 MB or smaller.');
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').slice(-100);
        const storagePath = `${folder}/${crypto.randomUUID()}-${safeName}`;
        const { error } = await supabase.storage.from('maak-public-media').upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) throw new Error(error.message);
        uploaded.push(supabase.storage.from('maak-public-media').getPublicUrl(storagePath).data.publicUrl);
      }
      setUrls((current) => [...current, ...uploaded]);
      setMessage(`${uploaded.length} image(s) uploaded. Save the form to attach them to this record.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  function removeImage(url: string) {
    setUrls((current) => current.filter((item) => item !== url));
    setMessage('Image marked for removal. Save the record to apply this change.');
  }

  return (
    <div className="image-upload-field">
      <label>
        Upload images (JPG, PNG, WebP, AVIF; max 10 MB each)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={!isSupabaseConfigured || busy}
          onChange={upload}
        />
      </label>
      {!isSupabaseConfigured && (
        <p className="muted">File upload activates after Supabase is configured and an authorised admin session is available. You can still paste approved image URLs below.</p>
      )}
      <label>
        Image URLs (one per line)
        <textarea
          name={name}
          rows={4}
          value={urls.join('\n')}
          onChange={(event) => setUrls(event.target.value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean))}
        />
      </label>
      {urls.length > 0 && (
        <div className="image-upload-previews" aria-label="Current image previews">
          {urls.map((url) => (
            <div className="image-upload-preview" key={url}>
              {/* External URLs are supplied by the authorised admin. */}
              <img src={url} alt="Property or project upload preview" />
              <button type="button" onClick={() => removeImage(url)} disabled={busy}>Remove image</button>
            </div>
          ))}
        </div>
      )}
      {busy && <p role="status">Uploading…</p>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
