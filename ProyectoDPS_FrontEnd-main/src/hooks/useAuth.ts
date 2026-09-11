import { useCallback, useMemo, useState } from 'react';

import { appConfig } from '../config/appConfig';
import type { User } from '../models/User';
import { MockAuthService } from '../services/MockAuthService';
import {
  hasValidationErrors,
  type LoginValidationErrors,
  validateLogin,
} from '../utils/validators';

interface UseAuthOptions {
  onAuthenticated: (user: User) => void;
}

export interface UseAuthResult {
  identifier: string;
  password: string;
  isPasswordVisible: boolean;
  isSubmitting: boolean;
  errors: LoginValidationErrors;
  generalError: string | null;
  setIdentifier: (value: string) => void;
  setPassword: (value: string) => void;
  togglePasswordVisibility: () => void;
  fillDemoCredentials: () => void;
  submit: () => Promise<void>;
}

export function useAuth({ onAuthenticated }: UseAuthOptions): UseAuthResult {
  const authService = useMemo(() => new MockAuthService(), []);
  const [identifier, setIdentifierValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierValue(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      identifier: undefined,
    }));
    setGeneralError(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordValue(value);
    setErrors((currentErrors) => ({
      ...currentErrors,
      password: undefined,
    }));
    setGeneralError(null);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((isVisible) => !isVisible);
  }, []);

  const fillDemoCredentials = useCallback(() => {
    setIdentifierValue(appConfig.demoCredentials.username);
    setPasswordValue(appConfig.demoCredentials.password);
    setErrors({});
    setGeneralError(null);
  }, []);

  const submit = useCallback(async () => {
    if (isSubmitting) {
      return;
    }

    const validationErrors = validateLogin(identifier, password);
    setErrors(validationErrors);
    setGeneralError(null);

    if (hasValidationErrors(validationErrors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authService.authenticate({ identifier, password });

      if (!result.success) {
        setGeneralError(result.message);
        return;
      }

      onAuthenticated(result.user);
    } catch {
      setGeneralError('Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [authService, identifier, isSubmitting, onAuthenticated, password]);

  return {
    identifier,
    password,
    isPasswordVisible,
    isSubmitting,
    errors,
    generalError,
    setIdentifier,
    setPassword,
    togglePasswordVisibility,
    fillDemoCredentials,
    submit,
  };
}
