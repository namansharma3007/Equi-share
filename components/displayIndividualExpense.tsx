import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

export function DisplayIndividualExpense({
  displayIndividualExpense,
  dialogExpenseOpen,
  setDialogExpenseOpen,
  user,
  handleSplitClearance,
}: {
  displayIndividualExpense: Expense | null;
  dialogExpenseOpen: boolean;
  setDialogExpenseOpen: Dispatch<SetStateAction<boolean>>;
  user: string;
  handleSplitClearance: ({
    split,
    expense,
  }: {
    split: Split | null;
    expense: Expense | null;
  }) => void;
}) {

  function setClearingSplitValue(split: Split, expense: Expense) {
    handleSplitClearance({split, expense})
  }

  if (!displayIndividualExpense) return null;

  return (
      <Dialog open={dialogExpenseOpen} onOpenChange={setDialogExpenseOpen}>
        <DialogContent className="pt-2 flex flex-col">
          <DialogTitle>
            {displayIndividualExpense.payerUser.firstName +
              " " +
              displayIndividualExpense.payerUser.lastName}
              {" "}
            (${displayIndividualExpense.amount}) 
          </DialogTitle>
          <DialogDescription>{displayIndividualExpense.name}</DialogDescription>
            {displayIndividualExpense.splits.map((split, index) => (
              <div
                key={index}
                className={`flex justify-between items-center border border-gray-600 p-2 rounded-md ${
                  split.cleared ? "bg-green-300" : ""
                }`}
              >
                <div
                  className={`${
                    split.cleared ? "text-black" : "text-gray-600"
                  }`}
                >
                  {split.userId === user ? (
                    <span className="text-sm">You (${split.amountOwed})</span>
                  ) : (
                    <span className="text-sm">
                      {split.user.firstName + " " + split.user.lastName} (${split.amountOwed})
                    </span>
                  )}
                </div>
                {
                  <div className={`${split.cleared ? "hidden" : "block"}`}>
                    <Button
                      size={"sm"}
                      onClick={() => {
                        setClearingSplitValue(split, displayIndividualExpense);
                      }}
                      className="bg-red-600 text-white hover:bg-red-700 border-none"
                    >
                      Clear
                    </Button>
                  </div>
                }
              </div>
            ))}
        </DialogContent>
      </Dialog>

  
  );
}