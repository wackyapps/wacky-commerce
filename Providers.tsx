"use client";
import { Toaster } from "react-hot-toast";
import React from "react";
import { HeroUIProvider } from "@heroui/react";
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
      <HeroUIProvider>{children}</HeroUIProvider>
    </>
  );
};

export default Providers;
