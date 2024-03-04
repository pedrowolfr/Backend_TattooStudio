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
          },
          {
            name: "last_name",
            type: "varchar",
            length: "50",
          },
          {
            name: "phone",
            type: "int",
            length: "20",
          },
          {
            name: "email",
            type: "varchar",
            length: "50",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            length: "100",
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
