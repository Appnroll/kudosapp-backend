import {MigrationInterface, QueryRunner} from "typeorm";

export class createUser1547044066243 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "image_24" character varying NOT NULL, "image_32" character varying NOT NULL, "image_48" character varying NOT NULL, "image_72" character varying NOT NULL, "image_192" character varying NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`)
    }

}
