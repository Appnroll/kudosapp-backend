import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigTestService} from "../src/config/type-orm-config-test.service";

describe('Kudos (e2e)', () => {
    let app: INestApplication;
    let kudosRepository: Repository<Kudos>;

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
        await kudosRepository.clear();
        await app.init();
    });

    describe('(GET) / ', () => {
        beforeEach(async () => {
            const exp = [...Array(5).keys()].map(el => kudosRepository.create({
                id: el+1,
                description: `${el} desc`,
                givenTo: `${el} dota`,
                from: `dota`,
                createdAt: new Date(),
                updatedAt: new Date()
            }));

            await kudosRepository.save(exp);
        });

        afterEach(async () => {
            await kudosRepository.clear();
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
