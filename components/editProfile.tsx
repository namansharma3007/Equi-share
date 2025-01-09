"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
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

type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
};

export default function EditProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
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
    console.log(formData);
  };

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm mx-auto">
      <CardContent className="pt-8">
        {error && (
          <div className="flex w-full items-center justify-center bg-red-500 p-2 rounded-md mb-2">
            <p className="text-gray-100 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
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
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe123"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={handleSelectChange} value={formData.gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
