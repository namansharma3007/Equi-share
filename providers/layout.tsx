import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const noNavBarPaths: Set<string> = new Set(["/login", "/signup", "/"]);
  return (
    <>
      {children}
      {!noNavBarPaths.has(pathname) && <Navbar />}
    </>
  );
};

export default Layout;
