import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, Min, IsEnum, IsUrl, IsBoolean, IsDecimal } from 'class-validator';
import { PetSpecies, PetGender } from '../pet.entity';

@InputType()
export class CreatePetInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => PetSpecies)
  @IsEnum(PetSpecies)
  species: PetSpecies;

  @Field()
  @IsNotEmpty()
  breed: string;

  @Field()
  @IsInt()
  @Min(0)
  age: number;

  @Field(() => PetGender)
  @IsEnum(PetGender)
  gender: PetGender;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsUrl()
  imageUrl: string;

  @Field(() => [String])
  @IsUrl({}, { each: true })
  images: string[];

  @Field()
  @IsNotEmpty()
  location: string;

  @Field(() => Float)
  @IsDecimal()
  @Min(0)
  adoptionFee: number;

  @Field()
  @IsBoolean()
  vaccinated: boolean;

  @Field()
  @IsBoolean()
  neutered: boolean;
}