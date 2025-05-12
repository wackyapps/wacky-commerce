"use client";
import { Toaster } from "react-hot-toast";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { Provider } from "react-redux";
import store from "./app/_redux/store";
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "17px",
          },
        }}
      />
      <HeroUIProvider>
        <Provider store={store}>{children}</Provider>
      </HeroUIProvider>
    </>
  );
};

export default Providers;
