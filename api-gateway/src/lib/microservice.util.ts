import { firstValueFrom, Observable } from 'rxjs';
import { AppException } from './app-exception';

export async function serviceCall<T>(observable: Observable<T>): Promise<T> {
  try {
    const res = await firstValueFrom(observable);
    return res;
  } catch (err: any) {
    const error = err?.error ?? err?.response ?? err;
    throw new AppException(
      error.statusCode ?? 500,
      error.code ?? 'INTERNAL_SERVER_ERROR',
      error.message ?? 'Internal Server Error',
      error.details,
    );
  }
}
