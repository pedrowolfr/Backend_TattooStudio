import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1704826677414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "role_id",
            type: "int",
            default: 1,
          },
          {
            name: "first_name",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "last_name",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "phone",
            type: "int",
            length: "20",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            length: "50",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          {
            columnNames: ["role_id"],
            referencedTableName: "roles",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
