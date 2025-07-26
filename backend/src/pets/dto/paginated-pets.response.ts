import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pet } from '../pet.entity';

@ObjectType()
export class PaginatedPetsResponse {
  @Field(() => [Pet])
  pets: Pet[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasNextPage: boolean;

  @Field(() => Int)
  totalPages: number;
}