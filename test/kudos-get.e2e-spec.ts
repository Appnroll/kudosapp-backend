import * as dotenv from "dotenv";
import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {seedDefaultData} from "./data.seeds";
import {UserKudosEntity} from "../src/kudos/model/user-kudos.entity";
import {User} from "../src/kudos/model/user.entity";
import {SlackToken} from "../src/kudos/model/slack-token.entity";

dotenv.config({path: `${__dirname}/../.env.test`})

describe('Kudos (e2e)', () => {
  let app: INestApplication;
  let kudosRepository: Repository<Kudos>;
  let userKudosEntityRepository: Repository<UserKudosEntity>;
  let userRepository: Repository<User>;
  let slackTokenRepository: Repository<SlackToken>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    kudosRepository = moduleFixture.get<Repository<Kudos>>(getRepositoryToken(Kudos));
    userKudosEntityRepository = moduleFixture.get<Repository<UserKudosEntity>>(getRepositoryToken(UserKudosEntity));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    slackTokenRepository = moduleFixture.get<Repository<SlackToken>>(getRepositoryToken(SlackToken));
    await app.init();
  });

  describe('(GET) / ', () => {
    beforeEach(async () => {
      await seedDefaultData(kudosRepository, userKudosEntityRepository, userRepository, slackTokenRepository);
    });

    afterEach(async () => {
      await userKudosEntityRepository.delete({});
      await kudosRepository.delete({});
      await userRepository.delete({});
    });

    it('should be successful', () => {
      return request(app.getHttpServer())
        .get('/kudos')
        .set('Authorization', 'Bearer: token')
        .expect(200)
    });

    it('should return all kudos', () => {
      return request(app.getHttpServer())
        .get('/kudos')
        .set('Authorization', 'Bearer: token')
        .expect(200)
        .then(res => {
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBe(5);
          expect(res.body.page).toBe(0);
          expect(res.body.hasNext).toBe(false);
          expect(res.body.size).toBe(5);
        })
    });
  })
});
