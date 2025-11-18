export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
