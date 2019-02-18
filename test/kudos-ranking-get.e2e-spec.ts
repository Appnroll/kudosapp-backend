import * as dotenv from "dotenv";
import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserKudosEntity} from "../src/kudos/model/user-kudos.entity";
import {User} from "../src/kudos/model/user.entity";
import {seedAuthData, seedDefaultData} from "./data.seeds";
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
        AppModule
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    kudosRepository = moduleFixture.get<Repository<Kudos>>(getRepositoryToken(Kudos));
    userKudosEntityRepository = moduleFixture.get<Repository<UserKudosEntity>>(getRepositoryToken(UserKudosEntity));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    slackTokenRepository = moduleFixture.get<Repository<SlackToken>>(getRepositoryToken(SlackToken));
    await app.init();
  });

  describe('(GET) /ranking ', () => {
    beforeEach(async () => {
      await seedAuthData(userRepository, slackTokenRepository);
    })

    afterEach(async () => {
      await userKudosEntityRepository.delete({});
      await slackTokenRepository.delete({})
      await kudosRepository.delete({});
      await userRepository.delete({});
    });

    it('should return empty response', () => {
      return request(app.getHttpServer())
        .get('/kudos/rankings')
        .set('Authorization', 'Bearer: token')
        .expect(200)
        .then(res => {
          expect(res.body.length).toBe([].length)
        })
    });
  })

  describe('(GET) /ranking ', () => {
    beforeEach(async () => {
      await seedDefaultData(kudosRepository, userKudosEntityRepository, userRepository, slackTokenRepository);
    });

    afterEach(async () => {
      await userKudosEntityRepository.delete({});
      await slackTokenRepository.delete({})
      await kudosRepository.delete({});
      await userRepository.delete({});
    });

    it('should be successful', () => {
      return request(app.getHttpServer())
        .get('/kudos/rankings')
        .set('Authorization', 'Bearer: token')
        .expect(200)
    });

    it('should return correct ranking data', () => {
      return request(app.getHttpServer())
        .get('/kudos/rankings')
        .set('Authorization', 'Bearer: token')
        .expect(200)
        .then(res => {
          expect(res.body.length).toBe(5)
          res.body.forEach((el) => {
            expect(Number(el.totalPoints)).toBe(1)
          })
        })
    });
  })
});
