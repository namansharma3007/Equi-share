import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Minus, UserRoundPlus } from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogIsAddingMember({
  isAddingMemberOpen,
  setIsAddingMemberOpen,
  searchTerm,
  setSearchTerm,
  availableMembers,
  alreadySentRequests,
  handleCancelRequest,
  sendGroupRequest,
  loadMoreMembers,
  isLoadingMembers,
}: {
  isAddingMemberOpen: boolean;
  setIsAddingMemberOpen: Dispatch<SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  availableMembers: User[];
  alreadySentRequests: GroupRequest[];
  handleCancelRequest: (toId: string) => void;
  sendGroupRequest: (toId: string) => void;
  loadMoreMembers: () => void;
  isLoadingMembers: boolean;
}) {


  return (
    <Dialog open={isAddingMemberOpen} onOpenChange={setIsAddingMemberOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-600 text-white hover:bg-purple-700 w-max"
          size="sm"
        >
          <UserRoundPlus className="h-4 w-4" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search for friends..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>
        <ScrollArea className="space-y-2 max-h-[300px] overflow-hidden no-scrollbar rounded pb-2">
          {availableMembers &&
            availableMembers.map((result: User) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="rounded-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={result.image} alt={result.username} />
                        <AvatarFallback>{result.firstName + " " + result.lastName}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {result.firstName + " " + result.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          @{result.username}
                        </p>
                      </div>
                    </div>
                    <div>
                      {alreadySentRequests &&
                      alreadySentRequests.find(
                        (request) => request.toId === result.id
                      ) ? (
                        <Button
                          onClick={() => handleCancelRequest(result.id)}
                          size="sm"
                          className="bg-red-500 hover:bg-red-700 text-white"
                        >
                          <Minus className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          onClick={() => sendGroupRequest(result.id)}
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-700 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </ScrollArea>
          {isLoadingMembers && (
            <div className="flex justify-center items-center py-4">
              <div className="w-9 h-9 rounded-full border-4 border-solid border-purple-500 border-l-gray-200 animate-spin"></div>
            </div>
          )}
        <Button onClick={loadMoreMembers} className="mt-2">
          Load More
        </Button>
      </DialogContent>
    </Dialog>
  );
}
