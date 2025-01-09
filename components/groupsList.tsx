import { ChangeEvent, FormEvent, SetStateAction, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { FormData, DeleteGroup } from "@/app/groups/page";

export default function GroupsList({
  groups,
  open,
  setOpen,
  isOpenAlert,
  setIsOpenAlert,
  groupDeleteId,
  newGroup,
  handleChange,
  handleSubmit,
  handleDelete,
  setDeleteGroup,
  viewDetailsRedirect,
  user,
}: {
  groups: Group[] | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isOpenAlert: boolean;
  setIsOpenAlert: Dispatch<SetStateAction<boolean>>;
  groupDeleteId: DeleteGroup;
  newGroup: FormData;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: (groupId: string) => Promise<void>;
  setDeleteGroup: (groupId: string | null, groupAdminId: string | null) => void;
  viewDetailsRedirect: (groupId: string) => void;
  user: string | null;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mb-6 bg-purple-600 text-white hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" /> Create New Group
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Enter a name for your new group. You can add members later.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Name</Label>
              <Input
                id="groupName"
                name="groupName"
                placeholder="Group name"
                value={newGroup.groupName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                name="groupDescription"
                placeholder="Group description"
                value={newGroup.groupDescription}
                onChange={handleChange}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {groups &&
        groups.map((group) => (
          <Card key={group.id} className="mb-2">
            <CardHeader className="-mb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {group.name}
                  {group.groupAdminId === user ? (
                    <p className="text-[10px] font-semibold text-white px-1.5 py-1 bg-purple-600 rounded-md">
                      Admin
                    </p>
                  ) : null}
                </span>
                <Button
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => setDeleteGroup(group.id, group.groupAdminId)}
                >
                  <Trash2 className="h-2 w-2" />
                </Button>
              </CardTitle>
              <CardDescription className="flex gap-2 flex-col">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <p className="font-medium">
                    {group.members.length} members{" "}
                    {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-md font-semibold text-gray-800">
                  {group.description}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => viewDetailsRedirect(group.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}

      <DeleteAlert
        groupDeleteId={groupDeleteId}
        handleDelete={handleDelete}
        isOpen={isOpenAlert}
        setIsOpen={setIsOpenAlert}
      />
    </motion.div>
  );
}

function DeleteAlert({
  groupDeleteId,
  handleDelete,
  isOpen,
  setIsOpen,
}: {
  groupDeleteId: DeleteGroup;
  handleDelete: (groupId: string) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            group and related expenses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleDelete(groupDeleteId.groupId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
