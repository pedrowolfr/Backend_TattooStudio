import { BaseEntity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn, Entity } from "typeorm"
import { Role } from "./Role";
import { Artist } from "./Artist";
import { Appoinment } from "./Appoinment";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    role_id!: number;

    @Column()
    first_name!: string;

    @Column()
    last_name!: string;

    @Column()
    portfolio!: string;

    @Column()
    phone!: number;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    created_at!: Date;

    @Column()
    updated_at!: Date;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({name: "role_id"})
    role!: Role;

    @ManyToOne(() => Artist, (artist) => artist.users)
    @JoinColumn ({name: "artist_id"})
    artist!: Artist;

    @OneToMany(() => Appoinment, (appoinment) => appoinment.artist)
    customerAppoinments!: Appoinment[];
}
