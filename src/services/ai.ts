import axios from 'axios';

type Tone = 'witty' | 'serene' | 'neutral';

export async function askEchoGuide(prompt: string, opts?: { tone?: Tone; system?: string }) {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY');
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: opts?.system ?? 'You are EchoGuide, a calm, helpful companion.' },
      { role: 'user', content: `[tone=${opts?.tone ?? 'neutral'}] ${prompt}` },
    ],
  };
  const { data } = await axios.post('https://api.openai.com/v1/chat/completions', body, {
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  const text =
    data.choices?.[0]?.message?.content ??
    'I am here to help you explore. Try asking about nearby parks or cafes.';
  return text;
}
