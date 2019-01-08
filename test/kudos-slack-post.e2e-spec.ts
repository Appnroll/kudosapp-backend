import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigTestService} from "../src/config/type-orm-config-test.service";
import {AppModule} from "../src/app.module";

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

    describe('(POST) /slack ', () => {

        const postDto = {text: 'dota; dota', token: 'uguIvg4jtfZ0wQ5r2MOTXBiC', user_name: 'FROM DOTA HIMSELF'};
        const successfulResponse = {
            text: `✅ Thanks for submitting Kudos!`
        }

        afterEach(async () => {
            await kudosRepository.clear();
        });

        it('should be successful', () => {
            return request(app.getHttpServer())
                .post('/kudos/slack')
                .send(postDto)
                .expect(201)
                .then(res => {
                    expect(res.body).toMatchObject(successfulResponse)
                })
        });
    })
});
