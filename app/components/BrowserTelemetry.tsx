// as before - send it to the browser
'use client';


import {HoneycombWebSDK} from "@honeycombio/opentelemetry-web";
import {getWebAutoInstrumentations} from "@opentelemetry/auto-instrumentations-web";

const apiKey = process.env.NEXT_PUBLIC_HONEYCOMB_API_KEY;

export function BrowserTelemetry() {

   // New: only run on server, not on client. 
   // Get out if it tries to SSR this. Also exit if
   // the apiKey isn't present
    if (typeof window === 'undefined' || !apiKey) {
       return null;
    }
   
    try {
      // our open source SDK provides sensible instrumentation
      // choices by default, including adding core web vitals
      // and enhanced web attributes in browser-generated spans
           const webSDK = new HoneycombWebSDK({
             serviceName: 'chloemathews.net-frontend',
             apiKey,

             instrumentations: [getWebAutoInstrumentations()]
           });
           webSDK.start();
      } catch (e) {
        // report any errors, but do not do anything that
        // would crash the user interface (like re-throwing
        // an exception) if the start() method throws one,
        // or your telemetry problem could make the application
        // unusable.
        console.error(e);
      }

  // this component doesn't render anything
  return null;
}