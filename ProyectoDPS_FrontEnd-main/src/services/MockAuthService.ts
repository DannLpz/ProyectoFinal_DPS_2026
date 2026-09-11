import { appConfig } from '../config/appConfig';
import type { AuthCredentials, AuthResult } from '../models/AuthResult';
import type { AuthService } from './AuthService';

function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}

export class MockAuthService implements AuthService {
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    await wait(appConfig.mockAuthDelayMs);

    const usernameMatches =
      credentials.identifier.trim().toLowerCase() === appConfig.demoCredentials.username;
    const passwordMatches = credentials.password === appConfig.demoCredentials.password;

    if (!usernameMatches || !passwordMatches) {
      return {
        success: false,
        message: 'No pudimos iniciar sesión. Revisa las credenciales de demostración.',
      };
    }

    return {
      success: true,
      token: 'fake-jwt-token-for-demo',
      user: {
        id: 'demo-user',
        username: appConfig.demoCredentials.username,
        displayName: 'Cliente demo',
        role: 'buyer',
      },
    };
  }
}