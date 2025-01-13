"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { useUserContext } from "@/context/userProvider";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/userProfile";
import EditProfile from "@/components/editProfile";
import { handleLogoutFunction } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export type FormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
};
export type PlaceholderValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender: string;
};
export default function ProfilePage() {
  const router = useRouter();
  const { user, token, userData, setToken, setUserId, setUserData } =
    useUserContext();

  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    gender: "",
  });

  const [placeholderValues, setPlaceholderValues] = useState<PlaceholderValues>(
    {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      gender: "",
    }
  );

  const handleLogout = async () => {
    const result = await handleLogoutFunction();
    if (result) {
      setUserId("");
      setToken(false);
      setUserData(null);
      toast({
        title: "Logged out successfully",
        variant: "success",
        duration: 2000,
      });
      router.push("/");
    } else {
      toast({
        title: "Internal server error!",
        description: "Please try again later",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (userData && user && token) {
      setPlaceholderValues({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        gender: String(userData.gender),
      });
    }
  }, [userData, user, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.firstName && !formData.lastName && !formData.username && !formData.email && !formData.gender) {
      return;
    }

    try {
      const response = await fetch("/api/users/edit-profile", {
        method: "PATCH",
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
        title: "Profile updated successfully!",
        description: "Reloading in 3 seconds",
        variant: "success",
        duration: 2000,
      });
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        gender: "",
      }));

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      toast({
        title: "Internal server error!",
        description: "Please try again later",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 p-4">
      <main className="max-w-3xl mx-auto pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between w-full mb-6"
        >
          <h1 className="text-3xl font-bold text-purple-800">Settings</h1>
          <Button
            onClick={handleLogout}
            size="sm"
            className="w-max border-red-600 bg-red-600 hover:bg-red-700 text-white"
          >
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-200 rounded-lg">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="edit-profile"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Edit profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <UserProfile userData={userData} />
            </TabsContent>

            <TabsContent value="edit-profile" className="space-y-4 mt-4">
              <EditProfile
                error={error}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                placeholderValues={placeholderValues}
                formData={formData}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
