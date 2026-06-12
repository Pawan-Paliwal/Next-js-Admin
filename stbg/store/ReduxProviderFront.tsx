'use client';

import { Provider } from "react-redux";
import { frontendStore } from "./frontendStore";
import { ReactNode } from "react";

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProviderFront({ children }: ReduxProviderProps) {
  return <Provider store={frontendStore}>{children}</Provider>;
}