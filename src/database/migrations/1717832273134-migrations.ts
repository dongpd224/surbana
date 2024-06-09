import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationTable1627949861507 implements MigrationInterface {
  name = 'CreateLocationTable1627949861507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS location_schema`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE location_schema.building (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying NOT NULL,
          CONSTRAINT "PK_123456789" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE location_schema.location (
        "id" uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        "name" character varying NOT NULL,
        "location_code" character varying NOT NULL,
        "area" double precision NOT NULL,
        "building_id" uuid,
        "parent_location_id" uuid,
        CONSTRAINT "FK_building_id" FOREIGN KEY ("building_id") REFERENCES location_schema.building("id") ON DELETE NO ACTION,
        CONSTRAINT "FK_parent_location_id" FOREIGN KEY ("parent_location_id") REFERENCES location_schema.location("id") ON DELETE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "location" DROP CONSTRAINT "FK_parent_location_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "location" DROP CONSTRAINT "FK_building_id"
    `);

    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS location_schema`);
  }
}
