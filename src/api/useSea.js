import { useEffect, useState } from "react";
import { getSeaForecast } from "./ferryApi.js";

// Loads Open-Meteo forecasts for the given ports. Value per port: object = loaded, false = failed, undefined = loading.
export function useSeaForecasts(ports) {
  const [map, setMap] = useState({});
  const key = [...new Set(ports)].sort().join(",");
  useEffect(() => {
    let live = true;
    key.split(",").filter(Boolean).forEach((p) => getSeaForecast(p).then((f) => live && setMap((m) => ({ ...m, [p]: f || false }))));
    return () => { live = false; };
  }, [key]);
  return map;
}
