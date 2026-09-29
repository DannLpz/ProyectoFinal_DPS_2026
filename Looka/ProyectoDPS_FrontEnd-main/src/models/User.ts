export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
}
