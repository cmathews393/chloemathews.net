import "./globals.css";
import type { ReactNode } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 
  {
    template: '%s | Chloe Mathews',
    default: 'Chloe Mathews | DevOps Engineer',
  },
  description: 'Homepage for Chloe Mathews, DevOps Engineer.',

};
config.autoAddCss = false;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

      </body>
    </html>
  );
}
