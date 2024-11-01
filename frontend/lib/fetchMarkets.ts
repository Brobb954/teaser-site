import {
  Market,
  MarketResponse,
  PredictionMarket,
  PredictionOption,
  ResponseMarket,
  ResponseOptions,
} from "@/types/market";

export async function GetMarket(): Promise<undefined | Market> {
  const url = `http://traefik/api/v1/market/1`;
  console.log("Server-side request to:", url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        CacheControl: "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    console.log("Initial GET response status:", res.status);
    console.log(
      "Initial GET response headers:",
      Object.fromEntries(res.headers.entries()),
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("Network did not respond");
    }

    const data: MarketResponse = await res.json();
    console.log("Raw response data:", data);

    const { Market, Options } = data;

    const decodedMarket: ResponseMarket = {
      Marketid: Market.Marketid,
      Title: Market.Title,
      Volume: Market.Volume,
      Description: Market.Description,
    };

    const decodedOptions: ResponseOptions[] = Options.map((option) => ({
      Optionid: option.Optionid,
      Marketid: option.Marketid,
      Optiontext: option.Optiontext,
      Optioncount: option.Optioncount,
    }));
    decodedOptions.sort((a, b) => a.Optionid - b.Optionid);
    const predictionMarket: PredictionMarket = {
      marketId: decodedMarket.Marketid,
      title: decodedMarket.Title,
      volume: decodedMarket.Volume,
      description: decodedMarket.Description,
    };

    const predictionOption: PredictionOption[] = decodedOptions.map(
      (options) => ({
        optionId: options.Optionid,
        marketId: options.Marketid,
        predictionOption: options.Optiontext,
        optionsCount: options.Optioncount,
      }),
    );
    const market: Market = {
      predictionMarket: predictionMarket,
      predictionOptions: predictionOption,
    };
    return market;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Fetch error:", err.message);
      if (err.name == "AbortError") {
        console.error("Fetch aborted after 5 seconds");
      }
    }
    return undefined;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GetMarketBrowser(): Promise<undefined | Market> {
  const url = `http://localhost/api/v1/market/1`;
  console.log("Server-side request to:", url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        CacheControl: "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
    console.log("Browser GET response status:", res.status);
    console.log(
      "Browser GET response headers:",
      Object.fromEntries(res.headers.entries()),
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("Network did not respond");
    }

    const data: MarketResponse = await res.json();
    console.log("Raw response data:", data);
    const { Market, Options } = data;

    const decodedMarket: ResponseMarket = {
      Marketid: Market.Marketid,
      Title: Market.Title,
      Volume: Market.Volume,
      Description: Market.Description,
    };

    const decodedOptions: ResponseOptions[] = Options.map((option) => ({
      Optionid: option.Optionid,
      Marketid: option.Marketid,
      Optiontext: option.Optiontext,
      Optioncount: option.Optioncount,
    }));
    decodedOptions.sort((a, b) => a.Optionid - b.Optionid);
    const predictionMarket: PredictionMarket = {
      marketId: decodedMarket.Marketid,
      title: decodedMarket.Title,
      volume: decodedMarket.Volume,
      description: decodedMarket.Description,
    };

    const predictionOption: PredictionOption[] = decodedOptions.map(
      (options) => ({
        optionId: options.Optionid,
        marketId: options.Marketid,
        predictionOption: options.Optiontext,
        optionsCount: options.Optioncount,
      }),
    );
    const market: Market = {
      predictionMarket: predictionMarket,
      predictionOptions: predictionOption,
    };
    return market;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Fetch error:", err.message);
      if (err.name == "AbortError") {
        console.error("Fetch aborted after 5 seconds");
      }
    }
    return undefined;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function IncrementCounter(marketId: number, optionsId: number) {
  try {
    const url = `http://localhost/api/v1/market/${marketId}/option/${optionsId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
      },
    });
    console.log("PATCH response received:", response.status);
    if (!response.ok) {
      throw new Error("Incrementing did not work");
    }
  } catch (error) {
    console.log(`Something errored, should probably fix it: ${error}`);
  }
}

// {"Market":
//{"Marketid":0,
//"Title":{"String":"Countdown to Launch: Make Your Prediction","Valid":true},
//"Volume":1,
//"Description":"Help us kickstart our journey! Guess when our site will launch and be part of our story from the beginning."},

//"Options":
//[{"Optiontext":"1 to 2 Weeks", "Optioncount":0},
//{"Optiontext":"3 to 6 Weeks","Optioncount":0},
//{"Optiontext":"2 to 6 Months","Optioncount":1},
//{"Optiontext":"Never","Optioncount":0}]}"""
