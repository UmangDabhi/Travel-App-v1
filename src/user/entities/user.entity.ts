import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: '1234' })
    password: string;

    @Column({ type: "int", default: 3, comment: '1: Owner, 2: Manager, 3: Salesman, 4: Captain' })
    role: number;

    @Column({ type: "bigint" })
    phone_number: number;

    @Column({ type: 'boolean', default: true })
    is_sys_password: boolean;

    @Column({ nullable: true })
    profile_url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
