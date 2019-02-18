import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRelation1550236504739 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_present_entity" DROP CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f"`);
        await queryRunner.query(`ALTER TABLE "user_present_entity" DROP CONSTRAINT "REL_9639f05a7bf18fa5897327dd36"`);
        await queryRunner.query(`ALTER TABLE "user_present_entity" ADD CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_present_entity" DROP CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f"`);
        await queryRunner.query(`ALTER TABLE "user_present_entity" ADD CONSTRAINT "REL_9639f05a7bf18fa5897327dd36" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user_present_entity" ADD CONSTRAINT "FK_9639f05a7bf18fa5897327dd36f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
