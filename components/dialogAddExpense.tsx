import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "./ui/scroll-area";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { ExpenseFormData } from "@/app/groups/[groupId]/page";
import { Checkbox } from "@/components/ui/checkbox";

export default function DialogIsAdingExpense({
  isAddingExpenseOpen,
  setIsAddingExpenseOpen,
  handleAddExpenseChange,
  expenseFormData,
  handleSubmitExpense,
  handleSelectChange,
  groupMembers,
  user,
  handleCheckboxChange,
  handleRadioChange,
  howToSplit,
  handleManualSplitAmountChange,
  displayAmount,
}: {
  isAddingExpenseOpen: boolean;
  setIsAddingExpenseOpen: Dispatch<SetStateAction<boolean>>;
  handleAddExpenseChange: (e: ChangeEvent<HTMLInputElement>) => void;
  expenseFormData: ExpenseFormData;
  handleSubmitExpense: (e: FormEvent<HTMLFormElement>) => void;
  handleSelectChange: (value: string) => void;
  groupMembers: User[];
  user: string;
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRadioChange: (value: string) => void;
  howToSplit: string;
  handleManualSplitAmountChange: (
    e: ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
  displayAmount: number;
}) {
  return (
    <Dialog open={isAddingExpenseOpen} onOpenChange={setIsAddingExpenseOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-purple-600 text-white hover:bg-purple-700 w-max"
          size="sm"
        >
          <Plus className="h-4 w-4" /> Create New Expense
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
          <DialogDescription>
            Enter the details of the new expense.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="overflow-hidden max-h-[400px]">
          <form onSubmit={handleSubmitExpense} className="p-2">
            <section className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Expense</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={expenseFormData.name}
                  onChange={handleAddExpenseChange}
                  placeholder="Expense name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  name="amount"
                  value={
                    expenseFormData.amount === null
                      ? ""
                      : expenseFormData.amount
                  }
                  onChange={handleAddExpenseChange}
                  placeholder="Expense amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid by</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={expenseFormData.paidByUser}
                  required
                >
                  <SelectTrigger id="paidBy">
                    <SelectValue placeholder="Select the payer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={user}>You</SelectItem>
                    {groupMembers &&
                      groupMembers.map((member) => {
                        if (member.id !== user) {
                          return (
                            <SelectItem key={member.id} value={member.id}>
                              {member.firstName + " " + member.lastName}
                            </SelectItem>
                          );
                        }
                        return null;
                      })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="splits">Splits</Label>
                <div className="max-h-[150px] overflow-y-auto no-scrollbar rounded shadow-sm flex flex-col space-y-2 p-2 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      value={user}
                      id={user}
                      checked={expenseFormData.splits.some(
                        (split) => split.id === user
                      )}
                      onCheckedChange={(checked) => {
                        // Create a synthetic event for the checkbox change
                        const syntheticEvent = {
                          target: {
                            name: "splits",
                            value: user,
                            userName: "You",
                            checked: checked,
                          },
                        } as unknown as ChangeEvent<HTMLInputElement>; // Assert type as ChangeEvent<HTMLInputElement>

                        handleCheckboxChange(syntheticEvent);
                      }}
                    />
                    <Label htmlFor={user}>You</Label>
                  </div>

                  {groupMembers &&
                    groupMembers.map((member) => {
                      if (member.id !== user) {
                        return (
                          <div
                            key={member.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              value={member.id}
                              id={member.id}
                              checked={expenseFormData.splits.some(
                                (split) => split.id === member.id
                              )}
                              onCheckedChange={(checked) => {
                                // Create a synthetic event for the checkbox change
                                const syntheticEvent = {
                                  target: {
                                    name: "splits",
                                    value: member.id,
                                    userName: member.firstName + " " + member.lastName,
                                    checked: checked,
                                  },
                                } as unknown as ChangeEvent<HTMLInputElement>; // Assert type as ChangeEvent<HTMLInputElement>

                                handleCheckboxChange(syntheticEvent);
                              }}
                            />
                            <Label htmlFor={member.id}>
                              {member.firstName + " " + member.lastName}
                            </Label>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>How to split</Label>
                <RadioGroup
                  defaultValue="equally"
                  className="flex space-x-10"
                  onValueChange={handleRadioChange}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equally" id="equally" />
                    <Label htmlFor="equally">Equally</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manually" id="manually" />
                    <Label htmlFor="manually">Manually</Label>
                  </div>
                </RadioGroup>
              </div>

              {expenseFormData.splits.length > 0 && (
                <div className={`space-y-2 border p-2 rounded ${parseFloat(`${expenseFormData?.amount ?? "0"}`) < displayAmount ? "bg-red-300" : ''}`}>
                  {howToSplit === "manually" && (
                    <div className="flex w-full justify-around items-center">
                      <p className="text-sm text-center underline font-semibold">
                        Total expense: {expenseFormData.amount ? expenseFormData.amount : 0}
                      </p>
                      <p className="text-sm text-center underline font-semibold">
                        Amount added: {displayAmount ? displayAmount : 0}
                      </p>
                    </div>
                  )}

                  <div className="max-h-[150px] overflow-y-auto no-scrollbar shadow-sm">
                    {howToSplit === "equally" &&
                      expenseFormData.splits.map((split, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 my-1 p-1 rounded"
                        >
                          <p className="text-sm font-semibold">
                            {split.name}: {split.amount}
                          </p>
                        </div>
                      ))}
                    {howToSplit === "manually" &&
                      expenseFormData.splits.map((split, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 my-1 p-1 rounded flex justify-between items-center"
                        >
                          <Label htmlFor={String(index)}>{split.name}</Label>
                          <Input
                            id={String(index)}
                            type="number"
                            name="amount"
                            value={split.amount === null ? "" : split.amount}
                            placeholder="0.00"
                            className="max-w-[200px]"
                            onChange={(e) =>
                              handleManualSplitAmountChange(e, split.id)
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </section>

            <DialogFooter className="mt-4">
              <Button
                type="submit"
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                Add expense
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
