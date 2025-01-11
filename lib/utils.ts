import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(inputDate: string | undefined): string | undefined {
  if (!inputDate) return inputDate;
  const date = new Date(inputDate);

  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export async function getUserData() {
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
      return null;
    }
    return data;
  } catch (error) {
    toast({
      title: "Internal server error!",
      description: "Please try again later",
      variant: "destructive",
      duration: 2000,
    });
    return null;
  }
}
