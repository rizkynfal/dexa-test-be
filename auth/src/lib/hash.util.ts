import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password before storing it in the database.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compare a plain-text password (from a login request) against
 * the hashed password stored in the database.
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
