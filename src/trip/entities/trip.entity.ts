import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
export class Trip {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    trip_code: string;

    @Column()
    trip_destination: string;

    @Column({ type: "int", default: 0, comment: "1-1n2d, 2-2n3d, 3-3n4d, 4-4n5d, 5-5n6d, 6-6n7d, 7-7n8d, 8-8n9d, 9-9n10d, 10-10n11d, 11-11n12d" })
    trip_duration: string;

    @Column()
    trip_type: string;

    @Column()
    expected_date: string;

    @Column({ type: "int", default: 0, comment: "0-Pending, 1-Destined, 2-On Going, 3-Completed" })
    status: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;
}
