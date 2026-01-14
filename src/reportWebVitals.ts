// src/reportWebVitals.ts
import { onCLS, onFID, onFCP, onLCP, onTTFB, CLSMetric, FIDMetric, FCPMetric, LCPMetric, TTFBMetric } from "web-vitals";

// Fungsi untuk menangani pengukuran kinerja
const reportWebVitals = (onPerfEntry?: (metric: CLSMetric | FIDMetric | FCPMetric | LCPMetric | TTFBMetric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS((metric: CLSMetric) => {
      console.log("CLS:", metric);
      onPerfEntry(metric);
    });
    onFID((metric: FIDMetric) => {
      console.log("FID:", metric);
      onPerfEntry(metric);
    });
    onFCP((metric: FCPMetric) => {
      console.log("FCP:", metric);
      onPerfEntry(metric);
    });
    onLCP((metric: LCPMetric) => {
      console.log("LCP:", metric);
      onPerfEntry(metric);
    });
    onTTFB((metric: TTFBMetric) => {
      console.log("TTFB:", metric);
      onPerfEntry(metric);
    });
  }
};

export default reportWebVitals;
