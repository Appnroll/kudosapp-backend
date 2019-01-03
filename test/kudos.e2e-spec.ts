import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as request from 'supertest';
import {AppModule} from '../src/app.module';

describe('KudosController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('(GET) / ', () => {
        it('should be successful', () => {
            return request(app.getHttpServer())
                .get('/kudos')
                .expect(200)
        });
    })
});
