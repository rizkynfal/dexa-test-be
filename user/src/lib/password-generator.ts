import { randomInt } from 'crypto';

const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O to avoid ambiguity
const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz'; // no l/o to avoid ambiguity
const DIGITS = '23456789'; // no 0/1 to avoid ambiguity
const SYMBOLS = '!@#$%^&*';
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;

/**
 * Generate a random, human-typeable password.
 * Guarantees at least one uppercase, one lowercase, one digit, and one symbol.
 */
export function generatePassword(length = 10): string {
  if (length < 4) {
    throw new Error('Password length must be at least 4');
  }

  const requiredChars = [
    pickRandomChar(UPPERCASE),
    pickRandomChar(LOWERCASE),
    pickRandomChar(DIGITS),
    pickRandomChar(SYMBOLS),
  ];

  const remainingLength = length - requiredChars.length;
  const remainingChars = Array.from({ length: remainingLength }, () =>
    pickRandomChar(ALL_CHARS),
  );

  const passwordChars = shuffle([...requiredChars, ...remainingChars]);
  return passwordChars.join('');
}

function pickRandomChar(charset: string): string {
  return charset[randomInt(0, charset.length)];
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
