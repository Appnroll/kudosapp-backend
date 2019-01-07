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

        await app.init();
    });

    afterAll(async () => {
        await kudosRepository.clear();
    })

    describe('(GET) /kudos/given ', () => {
        it('should return empty response', () => {
            return request(app.getHttpServer())
                .get('/kudos/given')
                .expect(200)
                .then(res => {
                    expect(res.body.length).toBe([].length)
                })
        });

    })

    describe('(GET) /kudos/given ', () => {
        beforeEach(async () => {
            const exp = [...Array(5).keys()].map(el => kudosRepository.create({
                id: el + 1,
                description: `${el} desc`,
                givenTo: `${el} dota`,
                from: `dota`
            }));

            await kudosRepository.save(exp);
        });

        afterEach(async () => {
            await kudosRepository.clear();
        });

        it('should be successful', () => {
            return request(app.getHttpServer())
                .get('/kudos/given')
                .expect(200)
        });

        it('should return correct ranking data', () => {
            const response = [
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: '0 dota'
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: '1 dota'
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: '2 dota'
                }, {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: '3 dota'
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: '4 dota'
                }

            ]
            return request(app.getHttpServer())
                .get('/kudos/given')
                .expect(200)
                .then(res => {
                    expect(res.body).toMatchObject(response)
                })
        });
    })
});
