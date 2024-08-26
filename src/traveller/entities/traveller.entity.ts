import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Traveller {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    traveller_name: string
    
    @Column({type:"bigint"})
    phone_no: number

    @Column({ type:"bigint",nullable: true })
    secondary_phone_no: number

    @Column({ nullable: true })
    email: string

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
