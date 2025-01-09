import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GroupRequests({
  groupRequests,
  acceptRequest,
  declineRequest,
}: {
  groupRequests: GroupRequest[];
  acceptRequest: (groupId: string) => void;
  declineRequest: (groupId: string) => void;
}) {
  return (
    <>
      {groupRequests &&
        groupRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-semibold">
                      {request.group.name} [{request.group.members.length}]
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.group.description}
                    </p>
                  </div>
                </div>
                <div className="space-x-2 flex">
                  <Button
                    size="sm"
                    className="bg-green-500 text-white"
                    onClick={() => acceptRequest(request.group.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={() => declineRequest(request.group.id)}
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
    </>
  );
}
