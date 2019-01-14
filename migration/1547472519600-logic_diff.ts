import {MigrationInterface, QueryRunner} from "typeorm";

export class logicDiff1547472519600 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "kudos" DROP CONSTRAINT "FK_e497cbfb3b73b719cd8e03f02de"`);
        await queryRunner.query(`CREATE TABLE "user_kudos_entity" ("id" SERIAL NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "fromId" integer, "userId" integer, "kudosId" integer, CONSTRAINT "PK_d21a8114107903ea1b3415f01ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP CONSTRAINT "UQ_e497cbfb3b73b719cd8e03f02de"`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "fromId"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "slackId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_d3aa36970d8d9a94b5454110fe0" FOREIGN KEY ("fromId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_f228a2a4aebb161626d011ec80a" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_0928920d54f63e7b4ba36f557d8" FOREIGN KEY ("kudosId") REFERENCES "kudos"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_0928920d54f63e7b4ba36f557d8"`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_f228a2a4aebb161626d011ec80a"`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_d3aa36970d8d9a94b5454110fe0"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "slackId" SET DEFAULT 'empty'`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD "fromId" integer`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD CONSTRAINT "UQ_e497cbfb3b73b719cd8e03f02de" UNIQUE ("fromId")`);
        await queryRunner.query(`DROP TABLE "user_kudos_entity"`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD CONSTRAINT "FK_e497cbfb3b73b719cd8e03f02de" FOREIGN KEY ("fromId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
