import {MigrationInterface, QueryRunner} from "typeorm";

export class addTokenEntity1548686617800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "slack_token" ("id" SERIAL NOT NULL, "token" text NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_fe0993c1e184fec1628ff957a17" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "slack_token"`);
    }

}
