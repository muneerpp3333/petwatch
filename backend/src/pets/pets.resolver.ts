import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PetsService } from './pets.service';
import { Pet } from './pet.entity';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { PaginationArgs } from './dto/pagination.input';
import { PaginatedPetsResponse } from './dto/paginated-pets.response';

@Resolver(() => Pet)
export class PetsResolver {
  constructor(private readonly petsService: PetsService) {}

  @Mutation(() => Pet)
  createPet(@Args('createPetInput') createPetInput: CreatePetInput) {
    return this.petsService.create(createPetInput);
  }

  @Query(() => [Pet], { name: 'pets' })
  findAll() {
    return this.petsService.findAll();
  }

  @Query(() => PaginatedPetsResponse, { name: 'paginatedPets' })
  findAllPaginated(@Args('paginationArgs') paginationArgs: PaginationArgs) {
    return this.petsService.findAll(paginationArgs);
  }

  @Query(() => [Pet], { name: 'availablePets' })
  findAvailable() {
    return this.petsService.findAvailable();
  }

  @Query(() => PaginatedPetsResponse, { name: 'paginatedAvailablePets' })
  findAvailablePaginated(@Args('paginationArgs') paginationArgs: PaginationArgs) {
    return this.petsService.findAvailable(paginationArgs);
  }

  @Query(() => Pet, { name: 'pet' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.petsService.findOne(parseInt(id));
  }

  @Mutation(() => Pet)
  updatePet(@Args('updatePetInput') updatePetInput: UpdatePetInput) {
    return this.petsService.update(parseInt(updatePetInput.id), updatePetInput);
  }

  @Mutation(() => Boolean)
  removePet(@Args('id', { type: () => ID }) id: string) {
    return this.petsService.remove(parseInt(id));
  }
}