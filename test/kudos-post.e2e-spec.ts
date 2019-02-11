import * as dotenv from "dotenv";
import {HttpStatus, INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';
import {Repository} from "typeorm";
import {Kudos} from "../src/kudos/model/kudos.entity";
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {UserKudosEntity} from "../src/kudos/model/user-kudos.entity";
import {User} from "../src/kudos/model/user.entity";
import {DialogPostSlackDto, PayloadClass} from "../src/kudos/dto/dialog-post-slack.dto";
import {SlackService} from "../src/kudos/services/slack.service";
import {seedDefaultData} from "./data.seeds";
import {SlackToken} from "../src/kudos/model/slack-token.entity";

dotenv.config({path: `${__dirname}/../.env.test`})

describe('Kudos (e2e)', () => {
  let app: INestApplication;
  let kudosRepository: Repository<Kudos>;
  let userKudosEntityRepository: Repository<UserKudosEntity>;
  let userRepository: Repository<User>;
  let slackTokenRepository: Repository<SlackToken>;
  let slackService: SlackService;
  let responseOkSpy;
  let responseInvalidUserSpy;

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

    slackService = moduleFixture.get<SlackService>(SlackService)
    responseOkSpy = jest.spyOn(slackService, 'responseOk')
    responseInvalidUserSpy = jest.spyOn(slackService, 'responseInvalidUsername')
    await app.init();
  });

  describe('(POST) /slack ', () => {
    beforeEach(async () => {
      await seedDefaultData(kudosRepository, userKudosEntityRepository, userRepository, slackTokenRepository);
    });

    const postDto = {
      payload: JSON.stringify({
        response_url: 'response_url',
        submission: {description: 'descr', kudos_given: 'slack-id1'},
        token: 'token',
        user: {id: 'id', name: 'name1'}
      } as PayloadClass)
    } as DialogPostSlackDto;

    afterEach(async () => {
      await userKudosEntityRepository.delete({});
      await kudosRepository.delete({});
      await userRepository.delete({});
    });

    it('should be successful and call responseOk method', () => {
      return request(app.getHttpServer())
        .post('/kudos/slack')
        .send(postDto)
        .then(res => {
          expect(responseOkSpy).toHaveBeenCalled();
        })
    });

    it('should fail on missing description data', () => {
      return request(app.getHttpServer())
        .post('/kudos/slack')
        .send({
          payload: JSON.stringify({
            response_url: 'response_url',
            submission: {description: 'descr', kudos_given: 'wrong_slack_id'},
            token: 'token',
            user: {id: 'id', name: 'name1'}
          } as PayloadClass)
        })
        .then(res => {
          expect(responseInvalidUserSpy).toHaveBeenCalled();
        })
    });

    it('should fail on missing user data', () => {
      return request(app.getHttpServer())
        .post('/kudos/slack')
        .send({
          payload: JSON.stringify({
            response_url: 'response_url',
            submission: {description: 'descr', kudos_given: 'slack-id1'},
            token: 'token',
            user: {id: 'id', name: 'wrong_user_data'}
          } as PayloadClass)
        })
        .then(res => {
          expect(responseInvalidUserSpy).toHaveBeenCalled();
        })
    });
  })
});
