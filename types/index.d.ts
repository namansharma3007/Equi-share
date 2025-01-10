
enum Gender {
  MALE,
  FEMALE,
}
enum RequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  gender: Gender;
  expenses: Expense[];
  group: Group[];
  splits: Split[];
  groupAdmin: Group[];
  groupRequests: GroupRequest[];
  expenseCreator: Expense[];
  createdAt: DateTime;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  groupAdminId: string;
  groupAdmin: User;
  groupRequests: GroupRequest[];
  members: User[];
  expenses: Expense[];
  splits: Split[];
  createdAt: DateTime;
}

interface GroupRequest {
  id: string;
  groupId: string;
  toId: string;
  group: Group;
  toUser: User;
  status: RequestStatus;
  createdAt: DateTime;
}

interface Expense {
  id: string;
  name: string;
  amount: Decimal;
  groupId: string;
  paidByUser: string;
  expenseCreatorId: String
  cleared: boolean;
  group: Group;
  payerUser: User;
  splits: Split[];
  expenseCreator: User;
  createdAt: DateTime;
}

interface Split {
  id: string;
  amountOwed: Decimal;
  expenseId: string;
  userId: string;
  groupId: string;
  cleared: boolean;
  group: Group;
  expense: Expense;
  user: User;
  createdAt: DateTime;
}

interface UserContextType {
  user: string;
  token: boolean;
  setToken: (token: boolean) => void;
  setUserId: (userId: string) => void;
}



interface EmailTemplateProps {
    email: string;
    otp: string;
}