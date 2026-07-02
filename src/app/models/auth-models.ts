export type LoginRequest = {
  username: string;
  password: string;
};
export type AuthUser = {
  id: number;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  isProtected?: boolean;
  mustChangePassword: boolean;
};
export type User = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  isProtected?: boolean;
};
export type UserRole = 'admin' | 'waiter' | 'chef';
