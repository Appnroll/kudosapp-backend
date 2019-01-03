import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'appnroll123',
            database: process.env.DB_NAME || 'kudos',
            port: parseInt(process.env.DB_PORT) || 3306,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        };
    }
}
