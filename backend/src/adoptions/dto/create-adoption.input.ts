import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsOptional, IsInt } from 'class-validator';

@InputType()
export class CreateAdoptionInput {
  @Field(() => Int)
  @IsInt()
  petId: number;

  @Field({ nullable: true })
  @IsOptional()
  userId?: string;

  @Field()
  @IsNotEmpty()
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsNotEmpty()
  street: string;

  @Field()
  @IsNotEmpty()
  city: string;

  @Field()
  @IsNotEmpty()
  state: string;

  @Field()
  @IsNotEmpty()
  zipCode: string;

  @Field({ nullable: true })
  @IsOptional()
  country?: string;
}