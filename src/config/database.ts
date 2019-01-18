export default {
    type: process.env.TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    entities: [ __dirname + '/../**/**.entity{.ts,.js}'],
    logging: process.env.LOGGING,
    synchronize: process.env.SYNCHRONIZE,
    retryAttempts: true
};