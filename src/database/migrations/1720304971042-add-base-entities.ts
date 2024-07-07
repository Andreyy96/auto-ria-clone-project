import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBaseEntities1720304971042 implements MigrationInterface {
    name = 'AddBaseEntities1720304971042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."managers_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."managers_role_enum" NOT NULL DEFAULT 'manager', "image" text, CONSTRAINT "UQ_8d5fd9a2217bf7b16bef11fdf83" UNIQUE ("email"), CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid, "admin_id" uuid, "manager_id" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."admins_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."admins_role_enum" NOT NULL DEFAULT 'admin', "image" text, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "accessToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid, "admin_id" uuid, "manager_id" uuid, CONSTRAINT "PK_65140f59763ff994a0252488166" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "brand" text NOT NULL, "model" text NOT NULL, "user_price" text NOT NULL, "user_ccy" text NOT NULL, "region" text NOT NULL, "image" text, "price" text NOT NULL, "base_ccy" text NOT NULL DEFAULT 'UAH', "rate" text, "isActive" text NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sold_cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "brand" text NOT NULL, "model" text NOT NULL, "price" text NOT NULL, "region" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_be04068560885a92eda7e36748c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'salesman', "phone" text NOT NULL, "image" text, "isBaned" text NOT NULL DEFAULT false, "account" text NOT NULL DEFAULT 'base', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."admins_car_showroom_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "admins_car_showroom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."admins_car_showroom_role_enum" NOT NULL DEFAULT 'admin', "image" text, "car_showroom_id" uuid NOT NULL, CONSTRAINT "UQ_eccbc31e677eb0ccbea97a8112a" UNIQUE ("email"), CONSTRAINT "PK_75fc452437c0b2db8a5eae562e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."managers_car_showroom_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "managers_car_showroom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."managers_car_showroom_role_enum" NOT NULL DEFAULT 'manager', "image" text, "car_showroom_id" uuid NOT NULL, CONSTRAINT "UQ_1f8ee02645fc18fb6e7ab6aacc9" UNIQUE ("email"), CONSTRAINT "PK_832f26ede5c4a75629563122318" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mechanic_car_showroom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "car_showroom_id" uuid NOT NULL, CONSTRAINT "UQ_ff8d75dd9323631e7c953d72401" UNIQUE ("email"), CONSTRAINT "PK_5d9827c46bbd35244e41f1fd001" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_showrooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "region" text NOT NULL, CONSTRAINT "PK_980acf7cf57bbb85b929e28aa0a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_car_showroom_role_enum" AS ENUM('admin', 'manager', 'salesman', 'customer')`);
        await queryRunner.query(`CREATE TABLE "users_car_showroom" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" "public"."users_car_showroom_role_enum" NOT NULL DEFAULT 'salesman', "phone" text NOT NULL, "image" text, "isBaned" text NOT NULL DEFAULT false, "account" text NOT NULL DEFAULT 'base', "car_showroom_id" uuid NOT NULL, CONSTRAINT "UQ_cb64f0b3643cb7bd36249525380" UNIQUE ("email"), CONSTRAINT "UQ_386da5206b9560c2776f90fab20" UNIQUE ("phone"), CONSTRAINT "PK_97df0eebc7fa0acf50eef8add03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_ecd766716e82c2e0f1cf6cb6281" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_4a3d2a11e760de57a0cc674a281" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_tokens" ADD CONSTRAINT "FK_09ee750a035b06e0c7f0704687e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_tokens" ADD CONSTRAINT "FK_6c4981c22a3032b0e4afb18831b" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "access_tokens" ADD CONSTRAINT "FK_f0b402e7ca81ad1cebc8b4ac6a9" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sold_cars" ADD CONSTRAINT "FK_ac3b06fc102ea2d311100722444" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins_car_showroom" ADD CONSTRAINT "FK_122dcd854f5c5e268319a8403f8" FOREIGN KEY ("car_showroom_id") REFERENCES "car_showrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "managers_car_showroom" ADD CONSTRAINT "FK_e780be90332429ab89a135bb365" FOREIGN KEY ("car_showroom_id") REFERENCES "car_showrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mechanic_car_showroom" ADD CONSTRAINT "FK_d4a8af121536a32bf9ce86f550e" FOREIGN KEY ("car_showroom_id") REFERENCES "car_showrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_car_showroom" ADD CONSTRAINT "FK_a4677597ef2776df14273247c4a" FOREIGN KEY ("car_showroom_id") REFERENCES "car_showrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_car_showroom" DROP CONSTRAINT "FK_a4677597ef2776df14273247c4a"`);
        await queryRunner.query(`ALTER TABLE "mechanic_car_showroom" DROP CONSTRAINT "FK_d4a8af121536a32bf9ce86f550e"`);
        await queryRunner.query(`ALTER TABLE "managers_car_showroom" DROP CONSTRAINT "FK_e780be90332429ab89a135bb365"`);
        await queryRunner.query(`ALTER TABLE "admins_car_showroom" DROP CONSTRAINT "FK_122dcd854f5c5e268319a8403f8"`);
        await queryRunner.query(`ALTER TABLE "sold_cars" DROP CONSTRAINT "FK_ac3b06fc102ea2d311100722444"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`);
        await queryRunner.query(`ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_f0b402e7ca81ad1cebc8b4ac6a9"`);
        await queryRunner.query(`ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_6c4981c22a3032b0e4afb18831b"`);
        await queryRunner.query(`ALTER TABLE "access_tokens" DROP CONSTRAINT "FK_09ee750a035b06e0c7f0704687e"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_4a3d2a11e760de57a0cc674a281"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_ecd766716e82c2e0f1cf6cb6281"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "users_car_showroom"`);
        await queryRunner.query(`DROP TYPE "public"."users_car_showroom_role_enum"`);
        await queryRunner.query(`DROP TABLE "car_showrooms"`);
        await queryRunner.query(`DROP TABLE "mechanic_car_showroom"`);
        await queryRunner.query(`DROP TABLE "managers_car_showroom"`);
        await queryRunner.query(`DROP TYPE "public"."managers_car_showroom_role_enum"`);
        await queryRunner.query(`DROP TABLE "admins_car_showroom"`);
        await queryRunner.query(`DROP TYPE "public"."admins_car_showroom_role_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "sold_cars"`);
        await queryRunner.query(`DROP TABLE "cars"`);
        await queryRunner.query(`DROP TABLE "access_tokens"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TYPE "public"."admins_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "managers"`);
        await queryRunner.query(`DROP TYPE "public"."managers_role_enum"`);
    }

}
