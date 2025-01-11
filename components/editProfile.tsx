
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlaceholderValues, FormData } from "@/app/settings/page";

export default function EditProfile({
  error,
  handleSubmit,
  handleInputChange,
  handleSelectChange,
  placeholderValues,
  formData,
}: {
  error: string | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string) => void;
  placeholderValues: PlaceholderValues;
  formData: FormData;
}) {


  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm mx-auto">
      <CardContent>
        {error && (
          <div className="flex w-full items-center justify-center bg-red-500 p-2 rounded-md my-2">
            <p className="text-gray-100 text-sm font-medium text-center">
              {error}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="space-y-1">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder={placeholderValues.firstName}
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder={placeholderValues.lastName}
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={placeholderValues.username}
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={handleSelectChange} value={formData.gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder={placeholderValues.gender} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={placeholderValues.email}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
