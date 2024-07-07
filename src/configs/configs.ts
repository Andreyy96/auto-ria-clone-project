import * as process from 'process';

import { Config } from './configs.type';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT) || 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  },
  sentry: {
    dbs: process.env.SENTRY_DSN,
    debug: process.env.SENTRY_DEBUG === 'true',
    env: process.env.SENTRY_ENVIRONMENT,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  aws: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_S3_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    bucketUrl: process.env.AWS_S3_BUCKET_URL,
    endpoint: process.env.AWS_S3_ENDPOINT,
  },
  mailer: {
    name: process.env.NAME_ACCAOUNT_GMAIL,
    password: process.env.PASSWORD_ACCAOUNT_GMAIL,
  },
});
