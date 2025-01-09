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
import LoadingPage from "@/components/loadingPage";
import { handleLogoutFunction } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

type FormData = {
  name: string;
  username: string;
  email: string;
  gender: "";
};

export default function ProfilePage() {
  const { setToken, setUserId } = useUserContext();
  const router = useRouter();
  const { user, token } = useUserContext();
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    gender: "",
  });

  const handleLogout = async () => {
    const result = await handleLogoutFunction();
    if (result) {
      setUserId("");
      setToken(false);
      toast({
        title: "Logged out successfully",
        duration: 2000,
      });
      router.push("/");
    } else {
      toast({
        title: "Internval server error",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    setIsLoading(true);
    async function getUserData() {
      try {
        const response = await fetch(`/api/users/get-user/`, {
          method: "GET",
        });
        const data = await response.json();
        if (!response.ok) {
          toast({
            title: data.message,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setUserData(data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        toast({
          title: "Internal server error, please try again later!",
          variant: "destructive",
          duration: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    }
    getUserData();
  }, [user, token]);

  if (isLoading) return <LoadingPage />;
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
              <EditProfile userData={userData} user={user} token={token}/>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
