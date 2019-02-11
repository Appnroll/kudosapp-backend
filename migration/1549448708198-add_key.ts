import {MigrationInterface, QueryRunner} from "typeorm";

export class addKey1549448708198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "slack_token" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "slack_token" ADD CONSTRAINT "UQ_315add04ec37fb598eb615b3586" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "slack_token" ADD CONSTRAINT "FK_315add04ec37fb598eb615b3586" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "slack_token" DROP CONSTRAINT "FK_315add04ec37fb598eb615b3586"`);
        await queryRunner.query(`ALTER TABLE "slack_token" DROP CONSTRAINT "UQ_315add04ec37fb598eb615b3586"`);
        await queryRunner.query(`ALTER TABLE "slack_token" DROP COLUMN "userId"`);
    }

}
