"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userProvider";
import { usePathname } from "next/navigation";

export default function RedirectValidation({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  const pathsRedirect: Set<string> = new Set(["/login", "/signup", "/", "/login/forgetpassword"]);
  const specialRedirects: Set<string> = new Set(["/login", "/signup", "/login/forgetpassword" ]);

  useEffect(() => {
    const isLoggedIn = Boolean(user && token);
        
    if (!isLoggedIn) {
      if (!pathsRedirect.has(pathname)) {
        router.push("/login");
      }
    } else {
      if (specialRedirects.has(pathname)) {
        router.push("/dashboard");
      } else {
        router.push(pathname);
      }
    }
  }, [user, token, pathname, router]);

  return <>{children}</>;
}

