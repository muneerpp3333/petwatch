import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreatePetInput } from './create-pet.input';

@InputType()
export class UpdatePetInput extends PartialType(CreatePetInput) {
  @Field(() => ID)
  id: string;
}