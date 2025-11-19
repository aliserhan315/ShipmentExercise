import axios from "axios";

const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

export interface WeatherSnapshot {
  provider: "weatherapi";
  tempC?: number;
  condition?: string;
  icon?: string;
  locationName?: string;
  country?: string;
  raw?: any;
}

export const WeatherService = {
  async getWeatherForCityAndCountry(
    city: string,
    country: string 
  ): Promise<WeatherSnapshot | null> {
    if (!WEATHERAPI_KEY) {
      console.warn("WEATHERAPI_KEY not set, skipping weather lookup");
      return null;
    }

    const q = encodeURIComponent(city);
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${q}`;

    try {
      const { data } = await axios.get(url);

      return {
        provider: "weatherapi",
        tempC: data?.current?.temp_c,
        condition: data?.current?.condition?.text,
        icon: data?.current?.condition?.icon,
        locationName: data?.location?.name,
        country: data?.location?.country,
        raw: data,
      };
    } catch (err) {
      console.error("WeatherAPI error:", err);
      return null;
    }
  },
};
