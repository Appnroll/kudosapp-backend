import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {TypeOrmConfigTestService} from "../src/config/type-orm-config-test.service";
import {AppModule} from "../src/app.module";
import {UserKudosEntity} from "../src/kudos/model/user-kudos.entity";
import {User} from "../src/kudos/model/user.entity";
import {seedDefaultData} from "./data.seeds";
import {AvatarDto} from "../src/kudos/dto/avatar.dto";

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
            await seedDefaultData(kudosRepository, userKudosEntityRepository, userRepository);
        });

        afterEach(async () => {
            await userKudosEntityRepository.delete({});
            await kudosRepository.delete({});
            await userRepository.delete({});
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
                    givenTo: {
                        name: "name0",
                        avatar: {
                            image_24: "",
                            image_32: "",
                            image_48: "",
                            image_72: "",
                            image_192: "",
                        } as AvatarDto
                    }
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: {
                        name: "name1",
                        avatar: {
                            image_24: "",
                            image_32: "",
                            image_48: "",
                            image_72: "",
                            image_192: "",
                        } as AvatarDto
                    }
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: {
                        name: "name2",
                        avatar: {
                            image_24: "",
                            image_32: "",
                            image_48: "",
                            image_72: "",
                            image_192: "",
                        } as AvatarDto
                    }
                }, {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: {
                        name: "name3",
                        avatar: {
                            image_24: "",
                            image_32: "",
                            image_48: "",
                            image_72: "",
                            image_192: "",
                        } as AvatarDto
                    }
                },
                {
                    quantity: 1,
                    year: expect.any(Number),
                    month: expect.any(String),
                    givenTo: {
                        name: "name4",
                        avatar: {
                            image_24: "",
                            image_32: "",
                            image_48: "",
                            image_72: "",
                            image_192: "",
                        } as AvatarDto
                    }
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
