"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userProvider";

type FormData = {
  emailusername: string;
  password: string;
};

export default function Login() {
  const { setToken, setUserId, setUserData } = useUserContext();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    emailusername: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setToken(true);
      setUserId(data.userId);

      toast({
        title: "Login successful",
        duration: 2000,
      });
      setError(null);

      setFormData((prev) => ({ ...prev, emailusername: "", password: "" }));
      router.push("/dashboard");
    } catch (error) {
      setError("Internal server error, please try again later!");
      setToken(false);
      setUserId("");
      setUserData(null);
    }
  };
  return (
    <div className="min-h-screen bg-purple-100 flex items-center flex-col justify-center p-4">
      {error && (
        <div className="flex w-max items-center justify-center bg-red-500 p-4 rounded-md mb-6">
          <p className="text-gray-100 text-sm font-medium text-center">{error}</p>
        </div>
      )}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-purple-800">
            Welcome to EquiShare
          </CardTitle>
        </CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="emailusername">Email or username</Label>
                <Input
                  id="emailusername"
                  name="emailusername"
                  type="text"
                  placeholder="john@example.com or abc123"
                  value={formData.emailusername}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
              >
                Log in
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full">
              Don&apos;t have an account?&#160;
              <Link href="/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </motion.div>
      </Card>
    </div>
  );
}
