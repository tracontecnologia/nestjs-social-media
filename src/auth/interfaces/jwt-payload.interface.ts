export interface IJWTPayload {
  sub: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
}
