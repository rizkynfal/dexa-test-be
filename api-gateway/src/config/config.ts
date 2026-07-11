import * as dotenv from 'dotenv';
dotenv.config();
export const SERVICES_CONFIG = {
  USER: {
    URL: String(process.env.USER_SERVICE_URL),
    HOST: String(process.env.USER_SERVICE_HOST),
    PORT: Number(process.env.USER_SERVICE_PORT),
    NAME: String(process.env.USER_SERVICE_APP_NAME),
  },
  ATTENDANCE: {
    URL: String(process.env.ATTENDANCE_SERVICE_URL),
    HOST: String(process.env.ATTENDANCE_SERVICE_HOST),
    PORT: Number(process.env.ATTENDANCE_SERVICE_PORT),
    NAME: String(process.env.ATTENDANCE_SERVICE_APP_NAME),
  },
  AUTH: {
    URL: String(process.env.AUTH_SERVICE_URL),
    HOST: String(process.env.AUTH_SERVICE_HOST),
    PORT: Number(process.env.AUTH_SERVICE_PORT),
    NAME: String(process.env.AUTH_SERVICE_APP_NAME),
  },
};
export const APP_CONFIG = {
  NAME: process.env.APP_NAME,
  ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT),
  SECRET_KEY_INTERNAL: process.env.SECRET_KEY_INTERNAL,
  URL: process.env.APP_URL,
};
