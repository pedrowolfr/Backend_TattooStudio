import {
  BaseEntity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  Entity,
} from "typeorm";
import { User } from "./User";

@Entity("role")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  role_name!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
