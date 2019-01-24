import {MigrationInterface, QueryRunner} from "typeorm";

export class initSchema1548330301126 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slackId" character varying NOT NULL, "trelloName" character varying NOT NULL DEFAULT '', "trelloId" character varying NOT NULL DEFAULT '', "image_24" character varying NOT NULL, "image_32" character varying NOT NULL, "image_48" character varying NOT NULL, "image_72" character varying NOT NULL, "image_192" character varying NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_kudos_entity" ("id" SERIAL NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "fromId" integer, "userId" integer, "kudosId" integer, CONSTRAINT "PK_d21a8114107903ea1b3415f01ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "kudos" ("id" SERIAL NOT NULL, "description" text NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_ed7aa56ecf082848c38a3cde5d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_d3aa36970d8d9a94b5454110fe0" FOREIGN KEY ("fromId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_f228a2a4aebb161626d011ec80a" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD CONSTRAINT "FK_0928920d54f63e7b4ba36f557d8" FOREIGN KEY ("kudosId") REFERENCES "kudos"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_0928920d54f63e7b4ba36f557d8"`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_f228a2a4aebb161626d011ec80a"`);
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP CONSTRAINT "FK_d3aa36970d8d9a94b5454110fe0"`);
        await queryRunner.query(`DROP TABLE "kudos"`);
        await queryRunner.query(`DROP TABLE "user_kudos_entity"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
