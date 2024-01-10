import { BaseEntity, Column, OneToMany, PrimaryGeneratedColumn, Entity } from "typeorm"
import { User } from "./User";
import { Design } from "./Design";
import { Appoinment } from "./Appoinment";

@Entity("artist")
export class Artist extends BaseEntity{
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

    @OneToMany(() => User, (user) => user.role)
    users!: User[];

    @OneToMany(() => Design, (design) => design)
    design!: Design[];

    @OneToMany(() => Appoinment, (appoinment) => appoinment.artist)
    customerAppoinments!: Appoinment[];
}
