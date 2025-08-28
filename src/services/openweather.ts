import axios from 'axios';

const API = 'https://api.openweathermap.org/data/2.5';

export type WeatherNow = {
  tempC: number;
  description: string;
  icon: string;
};

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherNow> {
  const key = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!key) throw new Error('Missing EXPO_PUBLIC_OPENWEATHER_API_KEY');
  const { data } = await axios.get(`${API}/weather`, {
    params: { lat, lon, appid: key, units: 'metric' },
  });
  return {
    tempC: data.main.temp,
    description: data.weather?.[0]?.description ?? '',
    icon: data.weather?.[0]?.icon ?? '01d',
  };
}
