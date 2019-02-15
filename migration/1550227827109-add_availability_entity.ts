import {MigrationInterface, QueryRunner} from "typeorm";

export class addAvailabilityEntity1550227827109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user_present_entity" ("id" SERIAL NOT NULL, "present" boolean NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "updatedAt" date NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_9639f05a7bf18fa5897327dd36" UNIQUE ("userId"), CONSTRAINT "PK_8fe9d62521f81b5e7d4c685f559" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_present_entity" ADD CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_present_entity" DROP CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f"`);
        await queryRunner.query(`DROP TABLE "user_present_entity"`);
    }

}
