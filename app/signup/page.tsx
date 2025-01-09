"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Asterisk } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/auth/signup", {
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
      toast({
        title: "Signup successful",
        duration: 2000,
      });
      setFormData((prev) => ({
        ...prev,
        name: "",
        username: "",
        email: "",
        gender: "",
        password: "",
        confirmPassword: "",
      }));
      router.push("/login");
    } catch (error) {
      setError("Internal server error, please try again later!");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-purple-800">
            Join EquiShare
          </CardTitle>
          <CardDescription className="text-sm text-center">
            Create your account to start splitting bills
          </CardDescription>
        </CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardContent>
            {error && (
              <div className="flex w-full items-center justify-center bg-red-500 p-2 rounded-md mb-2">
                <p className="text-gray-100 text-sm font-medium text-center">
                  {error}
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex gap-1">
                  First Name <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="flex gap-1">
                  Username <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe123"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex gap-1">
                  Email <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="flex gap-1">
                  Gender <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={formData.gender}
                  required
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex gap-1">
                  Password <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="flex gap-1">
                  Confirm Password <Asterisk className="h-3 w-3 text-red-500" />
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full ">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </motion.div>
      </Card>
    </div>
  );
}
