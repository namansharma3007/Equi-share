'use client'
import { Home, Users, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import {motion} from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  const pathname  = usePathname(); 
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    if(pathname.indexOf("groups") !== -1){ 
      setActivePage("groups");
    } else {
      setActivePage(pathname.substring(1));
    }
  }, [pathname]); 
  return (
    <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 0.2 }}
    className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto">
      <Card className="bg-purple-600 text-white border-purple-600">
        <CardContent className="p-2">
          <div className="flex justify-around items-center">
            <Link href="/dashboard" onClick={() => setActivePage("dashboard")}>
              <div
                className={`h-9 w-9 rounded flex items-center justify-center ${
                  activePage === "dashboard"
                    ? "bg-white text-black"
                    : "bg-purple-600 text-white"
                }`}
              >
                <Home className="h-4 w-4" />
              </div>
            </Link>


            <Link href="/groups" onClick={() => setActivePage("groups")}>
              <div
                className={`h-9 w-9 rounded flex items-center justify-center ${
                  activePage === "groups"
                    ? "bg-white text-black"
                    : "bg-purple-600 text-white"
                }`}
              >
                <Users className="h-4 w-4" />
              </div>
            </Link>

            <Link href="/settings" onClick={() => setActivePage("settings")}>
              <div
                className={`h-9 w-9 rounded flex items-center justify-center ${
                  activePage === "settings"
                    ? "bg-white text-black"
                    : "bg-purple-600 text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.nav>
  );
}