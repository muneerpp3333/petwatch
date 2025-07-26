import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AdoptionsService } from './adoptions.service';
import { Adoption } from './adoption.entity';
import { CreateAdoptionInput } from './dto/create-adoption.input';

@Resolver(() => Adoption)
export class AdoptionsResolver {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Mutation(() => Adoption)
  createAdoption(
    @Args('createAdoptionInput') createAdoptionInput: CreateAdoptionInput,
  ) {
    return this.adoptionsService.create(createAdoptionInput);
  }

  @Query(() => [Adoption], { name: 'adoptions' })
  findAll() {
    return this.adoptionsService.findAll();
  }

  @Query(() => Adoption, { name: 'adoption' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.adoptionsService.findOne(id);
  }

  @Mutation(() => Adoption)
  processPayment(@Args('id', { type: () => ID }) id: string) {
    return this.adoptionsService.processPayment(id);
  }
}