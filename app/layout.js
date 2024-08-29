import Header from "./_components/Header";
import "@/app/_styles/globals.css";

import { Josefin_Sans } from "next/font/google";
import { ReservationProvider } from "@/app/_components/ReservationContext";
import SessionWrapper from "./_components/SessionWrapper";

const josafin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // title: "The Wild Oasis"
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel, located in the heart of Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josafin.className} relative text-primary-100 bg-primary-950 min-h-screen flex flex-col`}
      >
        <SessionWrapper>
          <Header />
          <div className="flex-1 grid px-8 py-12">
            <main className="max-w-7xl mx-auto w-full">
              <ReservationProvider>{children}</ReservationProvider>
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
