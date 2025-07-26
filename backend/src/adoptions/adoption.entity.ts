import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Float } from '@nestjs/graphql';
import { Pet } from '../pets/pet.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
@Entity('adoptions')
export class Adoption {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  petId: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  userId?: string;

  @Field()
  @Column()
  fullName: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column()
  street: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  zipCode: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  country?: string;

  @Field(() => PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  adoptionFee: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Pet)
  @ManyToOne(() => Pet, pet => pet.adoptions)
  @JoinColumn({ name: 'petId' })
  pet: Pet;
}