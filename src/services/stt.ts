export type STTProvider = 'whisper' | 'google';

async function fileToBase64(uri: string): Promise<string> {
  const res = await fetch(uri);
  const buf = await res.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  // @ts-ignore
  if (typeof btoa !== 'undefined') return btoa(binary);
  // @ts-ignore
  return Buffer.from(binary, 'binary').toString('base64');
}

export async function transcribeAudio(
  uri: string,
  provider: STTProvider = (process.env.EXPO_PUBLIC_STT_PROVIDER as STTProvider) || 'google'
): Promise<string> {
  if (provider === 'google') {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_STT_API_KEY;
    if (!apiKey) throw new Error('Missing EXPO_PUBLIC_GOOGLE_STT_API_KEY');
    const audioContent = await fileToBase64(uri);
    const body = {
      config: {
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'default',
      },
      audio: {
        content: audioContent,
      },
    };
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        }
      );
      clearTimeout(id);
      if (!res.ok) throw new Error(`Google STT HTTP ${res.status}`);
      const data = await res.json();
      const text = data.results?.[0]?.alternatives?.[0]?.transcript;
      if (text) return text;
      throw new Error('No transcript');
    } catch (e) {
      throw e;
    }
  }
  throw new Error('Whisper STT not configured');
}
