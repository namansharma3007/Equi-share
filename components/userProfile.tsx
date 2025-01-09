import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { AtSign, Mail, CircleUser, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UserProfile({ userData }: { userData: User | null }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="w-full flex flex-col items-center space-y-4">
        <div className="flex flex-col justify-center items-center space-y-2">
          <Avatar className="w-28 h-28">
            <AvatarImage src={userData?.image} alt={userData?.username} />
            <AvatarFallback>{userData?.username}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-gray-700">
            {userData?.firstName + " " + userData?.lastName}
          </h1>
        </div>

        <div className="w-full flex flex-col justify-center space-y-2">
          <p className="text-gray-500 flex items-center gap-2 text-xl">
            <AtSign className="h-6 w-6 text-purple-600" />
            {userData?.username}
          </p>
          <p className="text-gray-500 flex items-center gap-2 text-xl">
            <Mail className="h-6 w-6 text-purple-600" />
            {userData?.email}
          </p>
          <p className="text-gray-500 flex items-center gap-2 text-xl">
            <CircleUser className="h-6 w-6 text-purple-600" />
            {userData?.gender}
          </p>
          <p className="text-gray-500 flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6 text-purple-600" />
            Joined: {formatDate(userData?.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}


