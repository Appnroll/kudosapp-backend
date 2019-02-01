const pathToConfiguration = process.env.NODE_ENV == 'production' ? '/../**/**.entity.js' : '/../**/**.entity{.ts,.js}';

export default {
  type: process.env.TYPE,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  entities: [__dirname + pathToConfiguration],
  logging: Boolean(process.env.LOGGING),
  synchronize: process.env.SYNCHRONIZE,
  retryAttempts: true
};