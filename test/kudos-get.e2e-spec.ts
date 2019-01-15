import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigTestService} from "../src/config/type-orm-config-test.service";
import {seedDefaultData} from "./data.seeds";
import {UserKudosEntity} from "../src/kudos/model/user-kudos.entity";
import {User} from "../src/kudos/model/user.entity";

describe('Kudos (e2e)', () => {
    let app: INestApplication;
    let kudosRepository: Repository<Kudos>;
    let userKudosEntityRepository: Repository<UserKudosEntity>;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [
                AppModule,
                TypeOrmModule.forRootAsync({
                    useClass: TypeOrmConfigTestService,
                })
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        kudosRepository = moduleFixture.get<Repository<Kudos>>(getRepositoryToken(Kudos));
        userKudosEntityRepository = moduleFixture.get<Repository<UserKudosEntity>>(getRepositoryToken(UserKudosEntity));
        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
        await app.init();
    });

    describe('(GET) / ', () => {
        beforeEach(async () => {
            await seedDefaultData(kudosRepository, userKudosEntityRepository, userRepository);
        });

        afterEach(async () => {
            await userKudosEntityRepository.delete({});
            await kudosRepository.delete({});
            await userRepository.delete({});
        });

        it('should be successful', () => {
            return request(app.getHttpServer())
                .get('/kudos')
                .expect(200)
        });

        it('should return all kudos', () => {
            return request(app.getHttpServer())
                .get('/kudos')
                .expect(200)
                .then(res => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBe(5);
                })
        });
    })
});
