export interface LoginValidationErrors {
  identifier?: string;
  password?: string;
}

export function validateLogin(
  identifier: string,
  password: string,
): LoginValidationErrors {
  const errors: LoginValidationErrors = {};

  if (!identifier.trim()) {
    errors.identifier = 'Ingresa tu usuario o correo.';
  }

  if (!password) {
    errors.password = 'Ingresa tu contraseña.';
  }

  return errors;
}

export function hasValidationErrors(errors: LoginValidationErrors): boolean {
  return Boolean(errors.identifier || errors.password);
}
