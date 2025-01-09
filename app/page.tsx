"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DollarSign, Users, PieChart, ArrowRight, LogOut } from "lucide-react";
import Link from "next/link";
import { useUserContext } from "@/context/userProvider";
import { handleLogoutFunction } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const { user, token, setToken, setUserId } = useUserContext();

  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch(`/api/users/get-user/`, {
          method: "GET",
        });
        const data = await response.json();
        if (!response.ok) {
          return;
        }
        setUserData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
      }
    }
    getUserData();
  }, [user, token]);

  const handleLogout = async () => {
    const result = await handleLogoutFunction();
    if (result) {
      setUserId("");
      setToken(false);
      setUserData(null);
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
    } else {
      toast({
        title: "Internval server error",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-purple-200 flex flex-col justify-between">
      <header className="p-4 flex justify-end">
        {userData ? (
          <div className="flex items-center space-x-2">
            <Avatar className="w-10 h-10 mr-2">
              <AvatarImage src={userData.image} alt={userData.name} />
              <AvatarFallback>{userData.name}</AvatarFallback>
            </Avatar>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="mr-2 bg-purple-600 text-white hover:bg-purple-700 hover:text-white"
              >
                Dashboard
                <ArrowRight />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-600 bg-red-600 hover:bg-red-700 hover:text-white text-white"
            >
              <LogOut />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="mr-2 bg-white text-purple-600 hover:bg-purple-100"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-purple-600 text-center mb-6">
            Split Bills, Not Friendships
          </h1>
          <p className="text-xl text-purple-500 text-center mb-12 max-w-2xl mx-auto">
            Effortlessly manage shared expenses and keep your finances in
            harmony with our intuitive bill-splitting app.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {[
            {
              icon: DollarSign,
              title: "Easy Splitting",
              description:
                "Divide expenses fairly among friends with just a few taps.",
            },
            {
              icon: Users,
              title: "Group Management",
              description:
                "Create and manage multiple groups for different occasions or roommates.",
            },
            {
              icon: PieChart,
              title: "Expense Tracking",
              description:
                "Get a clear overview of who owes what with detailed reports and summaries.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm h-full">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-purple-600 mb-2" />
                  <CardTitle className="text-xl font-semibold text-purple-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <footer className="mt-12 py-6 bg-purple-600 text-white text-center ">
        <p>&copy; 2024 Equi-share. All rights reserved.</p>
      </footer>
    </div>
  );
}