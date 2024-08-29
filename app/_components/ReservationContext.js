"use client";

import { createContext, useContext, useState } from "react";

const ReservaionContext = createContext();

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservaionContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservaionContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservaionContext);
  if (context === undefined)
    throw new Error("Context was used outside provider");
  return context;
}

export { ReservationProvider, useReservation };
