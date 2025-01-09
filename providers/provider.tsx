"use client";
import { UserProvider } from "@/context/userProvider";
import Layout from "./layout";
import RedirectValidation from "./redirectValidation";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      <UserProvider>
        <RedirectValidation>
        {children}
        </RedirectValidation>
      </UserProvider>
    </Layout>
  );
}
