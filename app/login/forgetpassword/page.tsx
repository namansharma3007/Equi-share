"use client";

import {
  ChangeEventHandler,
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useState,
} from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

type PasswordsForm = {
  password: string;
  confirmPassword: string;
};

export default function ForgetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState<string>("");
  const [otpReceived, setOtpReceived] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [passwordsForm, setPasswordsForm] = useState<PasswordsForm>({
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOtpReceived(false);
    setIsLoading(true);
    try {
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      toast({
        title: "OTP SENT!",
        description: "Please check your email",
        variant: "success",
        duration: 2000,
      });
      setOtpReceived(true);
      setError(null);
    } catch (error) {
      setError("Internal server error, please try again later!");
      setOtpReceived(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOTPSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setOtpVerified(false);
    try {
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpInput }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      toast({
        title: "OTP VERIFIED!",
        variant: "success",
        duration: 2000,
      });
      setOtpInput("");
      setEmail("");
      setOtpVerified(true);
      setError(null);
    } catch (error) {
      setError("Internal server error, please try again later!");
      setOtpVerified(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNewPasswordsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setEmail("");
    try {
      const response = await fetch("/api/otp/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordsForm),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      toast({
        title: "Password changed successfully",
        description: "You will be redirected to login page in 3 seconds",
        variant: "success",
        duration: 2000,
      });

      setTimeout(() => {
        setOtpVerified(false);
        setOtpReceived(false);
        router.push("/login");
      }, 3000);

      setTimeout(() => {
        setOtpVerified(false);
        setOtpReceived(false);
      }, 4000);

      setPasswordsForm({
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError("Internal server error, please try again later!");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      toast({
        title: "OTP RESENT!",
        description: "Please check your email",
        duration: 2000,
      });
      setError(null);
    } catch (error) {
      setError("Internal server error, please try again later!");
    } finally {
      setIsLoading(false);
    }
  }

  function handlePasswordsChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordsForm({
      ...passwordsForm,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="min-h-screen bg-purple-100 flex items-center flex-col justify-center p-4">
      {error && (
        <div className="flex w-max items-center justify-center bg-red-500 p-4 rounded-md mb-6">
          <p className="text-gray-100 text-sm font-medium text-center">
            {error}
          </p>
        </div>
      )}
      {!otpReceived ? (
        <Input_Email
          email={email}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      ) : !otpVerified ? (
        <OTP_INPUT
          otpInput={otpInput}
          setOtpInput={setOtpInput}
          handleOTPSubmit={handleOTPSubmit}
          handleResendOTP={handleResendOTP}
        />
      ) : (
        <Change_Password
          passwordsForm={passwordsForm}
          handlePasswordsChange={handlePasswordsChange}
          handleNewPasswordsSubmit={handleNewPasswordsSubmit}
        />
      )}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <div className="w-9 h-9 rounded-full border-4 border-solid border-purple-500 border-l-gray-200 animate-spin"></div>
        </div>
      )}
    </div>
  );
}

function Input_Email({
  email,
  handleSubmit,
  handleInputChange,
}: {
  email: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleInputChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-purple-800">
          Please enter your registered email
        </CardTitle>
      </CardHeader>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="emailInput">Email</Label>
              <Input
                id="emailInput"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </motion.div>
    </Card>
  );
}

function OTP_INPUT({
  otpInput,
  setOtpInput,
  handleOTPSubmit,
  handleResendOTP,
}: {
  otpInput: string;
  setOtpInput: Dispatch<SetStateAction<string>>;
  handleOTPSubmit: FormEventHandler<HTMLFormElement>;
  handleResendOTP: () => void;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-purple-800">
          Please enter your OTP
        </CardTitle>
      </CardHeader>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardContent>
          <form
            className="flex gap-4 items-center flex-col"
            onSubmit={handleOTPSubmit}
          >
            <InputOTP
              maxLength={6}
              value={otpInput}
              onChange={(value) => setOtpInput(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Submit
            </Button>
          </form>
          <div className="flex justify-center mt-2">
            <Button
              className="w-max bg-transparent text-purple-600 shadow-none border-none hover:underline hover:bg-transparent"
              onClick={handleResendOTP}
            >
              Resend OTP
            </Button>
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
}

function Change_Password({
  passwordsForm,
  handlePasswordsChange,
  handleNewPasswordsSubmit,
}: {
  passwordsForm: PasswordsForm;
  handlePasswordsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNewPasswordsSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center text-purple-800">
          Please enter your new password
        </CardTitle>
      </CardHeader>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardContent>
          <form
            className="flex gap-4 items-center flex-col w-full"
            onSubmit={handleNewPasswordsSubmit}
          >
            <div className="w-full space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                value={passwordsForm.password}
                onChange={handlePasswordsChange}
                required
              />
            </div>
            <div className="w-full space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="******"
                value={passwordsForm.confirmPassword}
                onChange={handlePasswordsChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </motion.div>
    </Card>
  );
}
