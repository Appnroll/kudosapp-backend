import {MigrationInterface, QueryRunner} from "typeorm";

export class removeFields1547222507557 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "kudos_users_user" ("kudosId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_9c1615b26cb72a80b68c0fd726c" PRIMARY KEY ("kudosId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "givenTo"`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "from"`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD "fromId" integer`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD CONSTRAINT "UQ_e497cbfb3b73b719cd8e03f02de" UNIQUE ("fromId")`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD CONSTRAINT "FK_e497cbfb3b73b719cd8e03f02de" FOREIGN KEY ("fromId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "kudos_users_user" ADD CONSTRAINT "FK_9e10610614a14ca4c185eb23fd5" FOREIGN KEY ("kudosId") REFERENCES "kudos"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "kudos_users_user" ADD CONSTRAINT "FK_a2dbeb8122820963fddca1985ff" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "kudos_users_user" DROP CONSTRAINT "FK_a2dbeb8122820963fddca1985ff"`);
        await queryRunner.query(`ALTER TABLE "kudos_users_user" DROP CONSTRAINT "FK_9e10610614a14ca4c185eb23fd5"`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP CONSTRAINT "FK_e497cbfb3b73b719cd8e03f02de"`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP CONSTRAINT "UQ_e497cbfb3b73b719cd8e03f02de"`);
        await queryRunner.query(`ALTER TABLE "kudos" DROP COLUMN "fromId"`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD "from" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kudos" ADD "givenTo" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "kudos_users_user"`);
    }

}
