import { collectionTypeMap } from "src/Helper/helper";
import { Traveller } from "src/traveller/entities/traveller.entity";
import { Trip } from "src/trip/entities/trip.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    departure_from: string;

    @Column()
    total_pax: number;

    @Column()
    selling_price: number;

    @Column({ default: 0 })
    advance_received: number;

    @Column({ nullable: true })
    sharing_type: string;

    @Column({ nullable: true })
    traveller_remark: string;

    @Column({ default: 0 })
    collected_amount: number;

    @Column({ nullable: true, enum: collectionTypeMap })
    collection_type: number;

    @ManyToOne(() => User, { nullable: true, eager: true })
    @JoinColumn({ name: "collected_by" })
    collected_by: User;

    @Column({ default: false })
    payment_done: boolean;

    @ManyToOne(() => Trip, { eager: true })
    @JoinColumn({ name: "trip_id" })
    trip: Trip;

    @ManyToOne(() => Traveller, { eager: true })
    @JoinColumn({ name: "traveller_id" })
    traveller: Traveller;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "user_id" })
    user: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "owner_id" })
    owner: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deleted_at: Date;

    get total_amount(): number {
        return this.selling_price * this.total_pax;
    }

    get pending_amount(): number {
        return this.total_amount - this.advance_received - this.collected_amount;
    }
}
