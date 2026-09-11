import type { AuthCredentials, AuthResult } from '../models/AuthResult';

export interface AuthService {
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
}
