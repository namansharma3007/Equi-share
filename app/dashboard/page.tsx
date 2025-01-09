"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useUserContext } from "@/context/userProvider";
import { toast } from "@/hooks/use-toast";
import LoadingPage from "@/components/loadingPage";

export default function Dashboard() {
  const { user, token } = useUserContext();

  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user || !token) return;
    setIsLoading(true);
    async function getUserData() {
      try {
        const response = await fetch(`/api/users/user-expenses-info/`, {
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
        setUserData(data.userData);
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


  function setGreeting(){
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning"
    else if (hour < 18) return "Good afternoon";
    else return "Good evening";
  }

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
          {setGreeting()}, {userData?.firstName + " " + userData?.lastName}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-purple-500 text-white border-purple-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Summary</h2>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">You owe</p>
                  <p className="text-2xl font-bold">${
                    userData?.group.reduce((total, group)=> {
                      const expenses = group.expenses.filter(expense => expense.paidByUser !== user && expense.splits.some(split => split.userId === user));
                      const splits = expenses.map((expense) => {
                        const splits = expense.splits.filter((split: Split) => split.userId === user);
                        return splits;
                      });
                      return total + splits.reduce((sum, split) => {
                        return sum + split.reduce((splitSum, split) => {
                          return splitSum + parseFloat(split.amountOwed ?? 0);
                        }, 0);
                      }, 0);
                    }, 0)
                  }</p>
                </div>
                <div>
                  <p className="text-sm">You are owed</p>
                  <p className="text-2xl font-bold">$
                    {userData?.group.reduce((total, group)=> {
                      const expenses = group.expenses.filter(expense => expense.paidByUser === user);
                      return total + expenses.reduce((expenseSum, expense) => {
                        return expenseSum + expense.splits.reduce((sum, split) => {
                          return sum + (split.userId !== user ? parseFloat(split.amountOwed) : 0);
                        }, 0);
                      }, 0);
                    }, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-purple-800">
              Recent Transactions From Groups
            </h2>
            {userData && userData.group.map((group, index) => {
              const groupExpenses = group.expenses.filter(expense => 
                expense.paidByUser === user || expense.splits.some(split => split.userId === user)
              );
              return (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    {group.name}
                  </h3>
                  <div className="space-y-4">
                    {groupExpenses.length > 0 ? (
                      groupExpenses.map((expense, index) => (
                        <Card
                          key={index}
                          className={
                            expense.paidByUser === user ? "bg-green-100" : "bg-red-100"
                          }
                        >
                          <CardContent className="pt-2 flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{expense.name}{" "}({new Date(expense.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })})</p>
                              <p className="text-sm text-gray-600">
                                @{expense.payerUser.firstName + " " + expense.payerUser.lastName} (${expense.amount})
                              </p>
                            </div>
                            {expense.paidByUser === user ? (
                              <p className="text-green-600 font-semibold">
                                +$
                                {expense.splits.reduce(
                                  (sum: number, split: Split) =>
                                    sum +
                                    (split.userId !== user
                                      ? parseFloat(split.amountOwed)
                                      : 0),
                                  0
                                )}
                              </p>
                            ) : (
                              <p className="text-red-600 font-semibold">
                                {(() => {
                                  const amountOwed = expense.splits.find(
                                    (split) => split.userId === user
                                  )?.amountOwed;
                                  return amountOwed
                                    ? `-$${amountOwed}`
                                    : amountOwed;
                                })()}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">No recent expenses</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}