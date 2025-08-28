export type STTProvider = 'whisper' | 'google';

export async function transcribeAudio(uri: string, provider: STTProvider = (process.env.EXPO_PUBLIC_STT_PROVIDER as STTProvider) || 'whisper'): Promise<string> {
  if (provider === 'google') {
    throw new Error('Google STT not configured');
  }
  throw new Error('Whisper STT not configured');
}
