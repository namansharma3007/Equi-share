"use client";

import {
  useEffect,
  useState,
  FormEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
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

import { ArrowLeft, Trash2, Users } from "lucide-react";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/context/userProvider";
import { toast } from "@/hooks/use-toast";
import LoadingPage from "@/components/loadingPage";
import AccessDeniedPage from "@/components/accessDenied";
import DialogIsAddingExpense from "@/components/dialogAddExpense";
import DialogIsAddingMember from "@/components/dialogAddMember";
import { DisplayIndividualExpense } from "@/components/displayIndividualExpense";
import { Button } from "@/components/ui/button";

export type ExpenseFormData = {
  name: string;
  amount: number | null;
  groupId: string;
  paidByUser: string;
  splits: { id: string; amount: number | null; name: string }[];
};

export default function GroupExpensePage() {
  const { groupId } = useParams();
  const { user, token } = useUserContext();

  const [deleteAlertOpen, setDeleteAlertOpen] = useState<boolean>(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState<string>("");

  const [accessAllowed, setAccessAllowed] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groupDetails, setGroupDetails] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [displayExpenses, setDisplayExpenses] = useState<Expense[]>([]);
  const [totalGroupExpense, setTotalGroupExpense] = useState<number>(0);
  const [isAddingExpenseOpen, setIsAddingExpenseOpen] =
    useState<boolean>(false);
  const [isAddingMemberOpen, setIsAddingMemberOpen] = useState<boolean>(false);

  const [dialogExpenseOpen, setDialogExpenseOpen] = useState<boolean>(false);
  const [displayIndividualExpense, setDisplayIndividualExpense] =
    useState<Expense | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [alreadySentRequests, setAlreadySentRequests] = useState<
    GroupRequest[]
  >([]);
  const [howToSplit, setHowToSplit] = useState<string>("equally");
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<string>("all");

  const [expenseFormData, setExpenseFormData] = useState<ExpenseFormData>({
    name: "",
    amount: null,
    groupId: String(groupId),
    paidByUser: "",
    splits: [],
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`/api/group/search-for-members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchTerm: searchTerm,
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
        setAvailableMembers(data);
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
      }
    }

    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (!token || !user) return;
    async function fetchGroupDetails() {
      try {
        const response = await fetch(
          `/api/group/get-group-details/${groupId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast({
            title: data.message,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setGroupDetails(data);
        setExpenses(data.expenses);
        return true;
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
        return false;
      }
    }
    async function fetchAlreadySentRequests() {
      try {
        const response = await fetch(
          `/api/group/group-request/already-sent-requests/${groupId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast({
            title: data.message,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setAlreadySentRequests(data);
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
    async function fetchGroupMembers() {
      try {
        const response = await fetch(
          `/api/group/get-group-members/${groupId}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          toast({
            title: data.message,
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setGroupMembers(data.members);
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
    async function fetchGroupExpenses() {
      try {
        const response = await fetch(`/api/group/expenses/${groupId}`, {
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

        setExpenses(data.expenses ?? []);
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

    Promise.all([
      fetchGroupDetails(),
      fetchAlreadySentRequests(),
      fetchGroupMembers(),
      fetchGroupExpenses(),
    ])
      .catch((error) => {
        console.log(error);
        toast({
          title:
            "Access denied or Internal server error, please try again later!",
          variant: "destructive",
          duration: 2000,
        });
      })
      .finally(() => setIsLoading(false));
  }, [groupId, token, user]);

  useEffect(() => {
    if (!expenses) return;
    const total = expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
    setTotalGroupExpense(total);
  }, [expenses]);

  useEffect(() => {
    if (!expenseFormData.amount) return;

    if (howToSplit === "equally") {
      const equalSplit = parseFloat(
        (expenseFormData.amount / expenseFormData.splits.length).toFixed(2)
      );
      setExpenseFormData((prevState) => ({
        ...prevState,
        splits: prevState.splits.map((split) => ({
          ...split,
          amount: equalSplit,
        })),
      }));
    } else {
      setExpenseFormData((prevState) => ({
        ...prevState,
        splits: prevState.splits.map((split) => ({
          ...split,
          amount: null,
        })),
      }));
      setDisplayAmount(0);
    }
  }, [howToSplit, expenseFormData.amount, expenseFormData.splits.length]);

  useEffect(() => {
    if (!expenses) return;
    // applyFilter(expenses, filterValue);
    let filteredExpenses = expenses;

    if (filterValue === "return") {
      filteredExpenses = expenses.filter(
        (expense) =>
          expense.paidByUser !== user &&
          expense.splits.some((split) => split.userId === user)
      );
    } else if (filterValue === "get") {
      filteredExpenses = expenses.filter(
        (expense) => expense.paidByUser === user
      );
    }
    setDisplayExpenses(filteredExpenses);
    // console.log(filterValue)
    // console.log("filteredExpenses", filteredExpenses);
    // console.log("filtered expenses expenses->", expenses);
  }, [filterValue, expenses, user]);


  const handleManualSplitAmountChange = (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { value } = e.target;

    const newAmount = parseFloat(value ?? "0");
    if (newAmount < 0) return;

    if (parseFloat(`${expenseFormData?.amount ?? "0"}`) < newAmount) return;

    const extractedSplits = expenseFormData.splits;

    let newSplits = extractedSplits.map((split) =>
      split.id === id ? { ...split, amount: value ? newAmount : null } : split
    );

    setExpenseFormData((prevState) => ({
      ...prevState,
      splits: newSplits,
    }));

    setDisplayAmount(
      newSplits.reduce((acc, split) => acc + (split.amount ?? 0), 0)
    );
  };

  const sendGroupRequest = async (toId: string) => {
    if (!groupId || !toId) return;
    try {
      const response = await fetch("/api/group/group-request/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
          toId: toId,
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
      setAlreadySentRequests([...alreadySentRequests, data.groupRequest]);
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

  const handleCancelRequest = async (toId: string) => {
    if (!groupId || !toId) return;
    try {
      const response = await fetch("/api/group/group-request/status/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupId: groupId,
          toId: toId,
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
      setAlreadySentRequests(
        alreadySentRequests.filter((request) => request.toId !== toId)
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

  function handleAddExpenseChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setExpenseFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { userName?: string }; // Extend the type
    const { value, checked } = target;
    const userName = target.userName;

    let prevSplits = expenseFormData.splits;

    if (checked) {
      prevSplits = [
        ...prevSplits,
        { id: value, amount: null, name: userName || "" },
      ];
    } else {
      prevSplits = prevSplits.filter((item) => item.id !== value);
    }
    setExpenseFormData((prevState) => ({
      ...prevState,
      splits: prevSplits,
    }));
    const total = prevSplits.reduce(
      (acc, split) => acc + (split.amount ?? 0),
      0
    );
    setDisplayAmount(total);
  };

  const handleSelectChange = (value: string) => {
    setExpenseFormData((prev) => ({ ...prev, paidByUser: value }));
  };

  const handleRadioChange = (value: string) => {
    setHowToSplit((prev) => (prev != value ? value : prev));
  };

  async function handleSubmitExpense(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/group/expenses/add-expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseFormData),
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
      setExpenses((prev) =>  [...prev, data.newExpense]);

      setIsAddingExpenseOpen(false);
      setExpenseFormData({
        name: "",
        amount: null,
        groupId: String(groupId),
        paidByUser: "",
        splits: [],
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
  }

  async function handleDeleteExpense(expenseId: string) {
    try {
      const response = await fetch("/api/group/expenses/delete-expense", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenseId }),
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
      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== data.expenseId)
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
  }

  async function handleSplitClearance({
    split,
    expense,
  }: {
    split: Split | null;
    expense: Expense | null;
  }) {
    if (!split || !expense) return;

    try {
      const response = await fetch("/api/group/expenses/split-clearance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          splitId: split.id,
          expenseId: expense.id,
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
      const splitOut = data.split.split;
      const clearedExpense = data.split.cleared;

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === splitOut.expenseId
            ? {
                ...expense,
                splits: expense.splits.map((splitExp) =>
                  splitExp.id === splitOut.id
                    ? { ...splitExp, cleared: splitOut.cleared }
                    : splitExp
                ),
                cleared: clearedExpense ? true : expense.cleared,
              }
            : expense
        )
      );

      setDisplayIndividualExpense((prev) => {
        if (!prev || !prev.splits) return null;
        return {
          ...prev,
          splits: prev.splits.map((split) =>
            split.id === splitOut.id
              ? { ...split, cleared: splitOut.cleared }
              : split
          ),
          cleared: clearedExpense ? true : prev.cleared,
        };
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
  }

  function openIndividualExpense(expense: Expense) {
    setDisplayIndividualExpense(expense);
    setDialogExpenseOpen(true);
  }

  if (isLoading) return <LoadingPage />;
  // else if (!accessAllowed) return <AccessDeniedPage navLink="/groups" />;
  else
    return (
      <>
        <div className="min-h-screen bg-purple-100 p-4">
          <main className="max-w-3xl mx-auto pb-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center space-x-2">
                <Link
                  href="/groups"
                  className="text-purple-600 hover:text-purple-800 bg"
                >
                  <ArrowLeft className="h-5 w-5 text-purple-600 hover:text-purple-800" />
                </Link>
                <h1 className="text-xl md:text-3xl font-bold text-purple-800">
                  {groupDetails?.name}
                </h1>
              </div>
              {groupDetails?.groupAdmin.id === user && (
                <DialogIsAddingMember
                  isAddingMemberOpen={isAddingMemberOpen}
                  setIsAddingMemberOpen={setIsAddingMemberOpen}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  availableMembers={availableMembers}
                  alreadySentRequests={alreadySentRequests}
                  handleCancelRequest={handleCancelRequest}
                  sendGroupRequest={sendGroupRequest}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="mb-6">
                <CardHeader className="-mb-2">
                  <CardTitle className="flex items-center justify-between">
                    {groupDetails?.description}
                    <span className="flex items-center gap-1">
                      <span className="text-[12px] text-white p-1.5 bg-purple-600 rounded-md">
                        Admin:
                      </span>
                      <span className="text-sm text-gray-800">
                        @{groupDetails?.groupAdmin.username}
                      </span>
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 my-2">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">
                        {groupMembers.length} members
                      </span>
                    </div>

                    <div className="text-lg font-semibold flex gap-1">
                      <p className="text-green-600">${totalGroupExpense}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center -space-x-4">
                    {groupMembers &&
                      groupMembers.map((member) => (
                        <Avatar key={member.id}>
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name}</AvatarFallback>
                        </Avatar>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-purple-800">
                  Expenses
                </h2>

                <DialogIsAddingExpense
                  isAddingExpenseOpen={isAddingExpenseOpen}
                  setIsAddingExpenseOpen={setIsAddingExpenseOpen}
                  handleAddExpenseChange={handleAddExpenseChange}
                  expenseFormData={expenseFormData}
                  handleSubmitExpense={handleSubmitExpense}
                  handleSelectChange={handleSelectChange}
                  groupMembers={groupMembers}
                  user={user}
                  handleCheckboxChange={handleCheckboxChange}
                  handleRadioChange={handleRadioChange}
                  howToSplit={howToSplit}
                  handleManualSplitAmountChange={handleManualSplitAmountChange}
                  displayAmount={displayAmount}
                />
              </div>

              <div className="flex w-full justify-start my-4">
                <Select
                  onValueChange={(value: string) => setFilterValue(value)}
                  value={filterValue}
                >
                  <SelectTrigger id="filter" className="bg-white w-[200px]">
                    <SelectValue placeholder="Select the filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All expenses</SelectItem>
                    <SelectItem value="return">You owe</SelectItem>
                    <SelectItem value="get">You are owed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                {displayExpenses &&
                  displayExpenses.map((expense, index) => (
                    <Card
                      className={`border-none ${
                        expense.paidByUser === user
                          ? "bg-green-100"
                          : expense.splits.find(
                              (split) => split.userId === user
                            )
                          ? "bg-red-100"
                          : ""
                      }`}
                      key={index}
                    >
                      <CardContent className="py-2 flex flex-col relative overflow-hidden">
                        <div className="flex w-full justify-between">
                          <CardTitle className="flex justify-center flex-col">
                            <span className="text-md font-semibold">
                              {expense.name}{" "}
                              ({new Date(expense.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })})
                            </span>
                            <span className="text-sm text-gray-600">
                              {expense.payerUser.name}{" "}
                              (${expense.amount})
                            </span>
                          </CardTitle>

                          <div className="font-bold">
                            {expense.paidByUser === user ? (
                              <p className="text-green-600">
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
                              <p className="text-red-600">
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
                          </div>
                        </div>

                        <div className="flex justify-between mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openIndividualExpense(expense)}
                          >
                            View Details
                          </Button>
                          {expense.cleared && (
                            <div className="text-lg font-bold">CLEARED</div>
                          )}
                          <Button
                            size="sm"
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => {
                              setDeleteExpenseId(expense.id);
                              setDeleteAlertOpen(true);
                            }}
                          >
                            <Trash2 className="h-2 w-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </motion.div>
          </main>

          <DisplayIndividualExpense
            displayIndividualExpense={displayIndividualExpense}
            dialogExpenseOpen={dialogExpenseOpen}
            setDialogExpenseOpen={setDialogExpenseOpen}
            handleSplitClearance={handleSplitClearance}
            user={user}
          />
        </div>
        <DeleteGroupAlert
          deleteAlertOpen={deleteAlertOpen}
          setDeleteAlertOpen={setDeleteAlertOpen}
          handleDeleteExpense={handleDeleteExpense}
          expenseId={deleteExpenseId}
        />
      </>
    );
}

function DeleteGroupAlert({
  deleteAlertOpen,
  setDeleteAlertOpen,
  handleDeleteExpense,
  expenseId,
}: {
  deleteAlertOpen: boolean;
  setDeleteAlertOpen: Dispatch<SetStateAction<boolean>>;
  handleDeleteExpense: (expenseId: string) => void;
  expenseId: string;
}) {
  return (
    <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            expense.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleDeleteExpense(expenseId)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
