import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigTestService implements TypeOrmOptionsFactory {

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'sqlite',
            database: process.env.DB_NAME || 'kudos',
            entities: [ __dirname + '/../**/**.entity{.ts,.js}'],
            synchronize: true,
        };
    }
}
