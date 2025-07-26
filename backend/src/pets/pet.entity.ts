import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType, Float } from '@nestjs/graphql';
import { Adoption } from '../adoptions/adoption.entity';

export enum PetSpecies {
  DOG = 'Dog',
  CAT = 'Cat',
  BIRD = 'Bird',
  RABBIT = 'Rabbit',
  OTHER = 'Other',
}

export enum PetGender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum AdoptionStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  ADOPTED = 'ADOPTED',
}

registerEnumType(PetSpecies, {
  name: 'PetSpecies',
});

registerEnumType(PetGender, {
  name: 'PetGender',
});

registerEnumType(AdoptionStatus, {
  name: 'AdoptionStatus',
});

@ObjectType()
@Entity('pets')
export class Pet {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => PetSpecies)
  @Column({
    type: 'enum',
    enum: PetSpecies,
    default: PetSpecies.DOG,
  })
  species: PetSpecies;

  @Field()
  @Column()
  breed: string;

  @Field()
  @Column('int')
  age: number;

  @Field(() => PetGender)
  @Column({
    type: 'enum',
    enum: PetGender,
  })
  gender: PetGender;

  @Field()
  @Column('text')
  description: string;

  @Field()
  @Column()
  imageUrl: string;

  @Field(() => [String])
  @Column('simple-array')
  images: string[];

  @Field()
  @Column()
  location: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  adoptionFee: number;

  @Field()
  @Column({ default: true })
  vaccinated: boolean;

  @Field()
  @Column({ default: true })
  neutered: boolean;

  @Field(() => AdoptionStatus)
  @Column({
    type: 'enum',
    enum: AdoptionStatus,
    default: AdoptionStatus.AVAILABLE,
  })
  adoptionStatus: AdoptionStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Adoption, adoption => adoption.pet)
  adoptions: Adoption[];
}