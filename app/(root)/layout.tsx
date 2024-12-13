import { StreamClientProvider } from "@/provider/StreamClientProvider";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling app",
  icons:{
    icon:'/icons/logo.svg'
  }
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamClientProvider>{children}</StreamClientProvider>
    </main>
  );
};

export default RootLayout;
