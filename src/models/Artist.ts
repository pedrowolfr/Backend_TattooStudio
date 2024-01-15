import {
  BaseEntity,
  Column,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Design } from "./Design";
import { Appointment } from "./Appointment";

@Entity("artists")
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  name!: string;

  @Column()
  portfolio!: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn({ name: "user_id" })
  users!: User[];

  @OneToMany(() => Design, (design) => design)
  design!: Design[];

  @OneToMany(() => Appointment, (appointment) => appointment.artist)
  customerAppoinments!: Appointment[];
}
