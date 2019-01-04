import {HttpStatus, INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigTestService} from "../src/config/type-orm-config-test.service";
import {PostKudosDto} from "../src/kudos/dto/postKudos.dto";
import {KudosDto} from "../src/kudos/dto/kudos.dto";

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

    describe('(POST) / ', () => {

        const postDto = {user: 'dota', from: 'dota allstars', description: 'for refactor'} as PostKudosDto;

        it('should be successful', () => {
            return request(app.getHttpServer())
                .post('/kudos')
                .send(postDto)
                .expect(201)
        });

        it('should return kudo data', () => {
            return request(app.getHttpServer())
                .post('/kudos')
                .send(postDto)
                .then(res => {
                    const response = res.body as KudosDto
                    expect(response.description).toBe(postDto.description)
                    expect(response.from).toBe(postDto.from)
                    expect(response.givenTo).toBe(postDto.user)
                })
        });

        it('should fail on missing data', () => {
            return request(app.getHttpServer())
                .post('/kudos')
                .send({user: postDto.user, from: postDto.from})
                .expect(HttpStatus.BAD_REQUEST)
        });
    })
});
