"use client";

import { motion } from "framer-motion";

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import GroupsList from "@/components/groupsList";
import GroupRequests from "@/components/groupRequests";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useUserContext } from "@/context/userProvider";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/loadingPage";

export type FormData = {
  groupName: string;
  groupDescription: string;
};

export type DeleteGroup = {
  groupId: string;
  groupAdminId: string;
};

export default function GroupsPage() {
  const { user, token } = useUserContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isOpenAlert, setIsOpenAlert] = useState<boolean>(false);
  const [groupRequests, setGroupRequests] = useState<GroupRequest[]>([]);
  const [groupDeleteId, setGroupDeleteId] = useState<DeleteGroup>({
    groupId: "",
    groupAdminId: "",
  });
  const [newGroup, setNewGroup] = useState<FormData>({
    groupName: "",
    groupDescription: "",
  });

  useEffect(() => {
    if (!user || !token) return;

    async function fetchGroups() {
      try {
        const response = await fetch(`/api/users/get-groups`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
        if (data.group.length > 0) {
          const sortedGroups = data.group.sort(
            (a: Group, b: Group) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setGroups(sortedGroups);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Internal server error, please try again later!";
        toast({
          title: "Internal server error, please try again later!",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
    async function fetchGroupRequests() {
      try {
        const response = await fetch(`/api/users/get-group-requests/`, {
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
        if (data) {
          setGroupRequests(data.groupRequests);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Internal server error, please try again later!";
        toast({
          title: "Internal server error, please try again later!",
          variant: "destructive",
          duration: 2000,
        });
      }
    }
    setIsLoading(true);
    Promise.all([fetchGroups(), fetchGroupRequests()]).catch((error) => console.log(error)).finally(() => setIsLoading(false))
  }, [user, token]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch("/api/group/create-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
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

      setGroups((previousGroups) => [data.newGroup, ...(previousGroups || [])]);

      toast({
        title: "Group created successfully",
        duration: 2000,
      });

      setOpen(false);
      setNewGroup((prev) => ({
        ...prev,
        groupName: "",
        groupDescription: "",
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Internal server error, please try again later!";
      toast({
        title: "Internal server error, please try again later!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDelete = async (groupId: string) => {
    if (!groupId) return;
    if (!user) return;

    try {
      const response = await fetch("/api/group/delete-group/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
        }),
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

      setGroups(
        (previousGroups) =>
          previousGroups?.filter((group) => group.id !== groupId) || null
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Internal server error, please try again later!";
      toast({
        title: "Internal server error, please try again later!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  function setDeleteGroup(groupId: string | null, groupAdminId: string | null) {
    if (!groupId || !groupAdminId) return;
    setGroupDeleteId((prev) => ({ ...prev, groupId: groupId }));
    setGroupDeleteId((prev) => ({ ...prev, groupAdminId: groupAdminId }));
    setIsOpenAlert(true);
  }

  function viewDetailsRedirect(groupId: string) {
    router.push(`/groups/${groupId}`);
  }

  const acceptRequest = async (groupId: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/group/group-request/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
          toId: user,
          status: "ACCEPTED",
        }),
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
      setGroupRequests((prevrequests) =>
        prevrequests.filter((request) => request.group.id !== groupId)
      );
      setGroups((previousGroups) => [
        data.updatedGroup.group,
        ...(previousGroups || []),
      ]);
      toast({
        title: "Request accepted",
        duration: 2000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Internal server error, please try again later!";
      toast({
        title: errorMessage,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const declineRequest = async (groupId: string) => {
    if (!user) return;

    try {
      const response = await fetch("/api/group/group-request/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
          toId: user,
          status: "REJECTED",
        }),
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
      setGroupRequests((prevrequests) =>
        prevrequests.filter((request) => request.group.id !== groupId)
      );
      toast({
        title: "Request rejected",
        duration: 2000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Internal server error, please try again later!";
      toast({
        title: "Internal server error, please try again later!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  if (isLoading) return <LoadingPage />;
  return (
    <div className="min-h-screen bg-purple-100 p-4">
      <main className="max-w-3xl mx-auto pb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-purple-800 mb-6"
        >
          Groups
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="available-groups" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-purple-200 rounded-lg">
              <TabsTrigger
                value="available-groups"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Available groups
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Group requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available-groups" className="space-y-4 mt-4">
              <GroupsList
                groups={groups}
                setOpen={setOpen}
                setIsOpenAlert={setIsOpenAlert}
                isOpenAlert={isOpenAlert}
                groupDeleteId={groupDeleteId}
                handleDelete={handleDelete}
                open={open}
                handleSubmit={handleSubmit}
                newGroup={newGroup}
                user={user}
                handleChange={handleChange}
                setDeleteGroup={setDeleteGroup}
                viewDetailsRedirect={viewDetailsRedirect}
              />
            </TabsContent>

            <TabsContent value="requests" className="space-y-4 mt-4">
              <GroupRequests
                groupRequests={groupRequests}
                acceptRequest={acceptRequest}
                declineRequest={declineRequest}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
