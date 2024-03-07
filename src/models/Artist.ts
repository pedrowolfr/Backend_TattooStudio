import {
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
export class Artist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  portfolio?: string;

  @Column()
  created_at!: Date;

  @Column()
  updated_at!: Date;

  @OneToMany(() => Design, (design) => design)
  design!: Design[];

  @OneToMany(() => Appointment, (appointment) => appointment.artist)
  customerAppointments!: Appointment[];

  @OneToOne(() => User, (user) => user.artist)
  @JoinColumn({ name: "user_id" })
  user!: User;
}
