import {MigrationInterface, QueryRunner} from "typeorm";

export class addHistoryDate1548341534623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" ADD "historyCreatedAt" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_kudos_entity" DROP COLUMN "historyCreatedAt"`);
    }

}
