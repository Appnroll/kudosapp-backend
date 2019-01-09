import {MigrationInterface, QueryRunner} from "typeorm";

export class createKudos1547044057516 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "kudos" ("id" SERIAL NOT NULL, "givenTo" character varying NOT NULL, "from" character varying NOT NULL, "description" text NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), CONSTRAINT "PK_ed7aa56ecf082848c38a3cde5d5" PRIMARY KEY ("id"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "kudos"`)
    }

}
