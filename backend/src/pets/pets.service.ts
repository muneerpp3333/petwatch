import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet, AdoptionStatus } from './pet.entity';
import { CreatePetInput } from './dto/create-pet.input';
import { UpdatePetInput } from './dto/update-pet.input';
import { PaginationArgs } from './dto/pagination.input';
import { PaginatedPetsResponse } from './dto/paginated-pets.response';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  async create(createPetInput: CreatePetInput): Promise<Pet> {
    const pet = this.petsRepository.create(createPetInput);
    return await this.petsRepository.save(pet);
  }

  async findAll(paginationArgs?: PaginationArgs): Promise<Pet[] | PaginatedPetsResponse> {
    if (!paginationArgs) {
      return await this.petsRepository.find({
        order: {
          createdAt: 'DESC',
        },
      });
    }

    const { page, limit } = paginationArgs;
    const skip = (page - 1) * limit;

    const [pets, totalCount] = await this.petsRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      pets,
      totalCount,
      page,
      limit,
      hasNextPage,
      totalPages,
    };
  }

  async findAvailable(paginationArgs?: PaginationArgs): Promise<Pet[] | PaginatedPetsResponse> {
    if (!paginationArgs) {
      return await this.petsRepository.find({
        where: {
          adoptionStatus: AdoptionStatus.AVAILABLE,
        },
        order: {
          createdAt: 'DESC',
        },
      });
    }

    const { page, limit } = paginationArgs;
    const skip = (page - 1) * limit;

    const [pets, totalCount] = await this.petsRepository.findAndCount({
      where: {
        adoptionStatus: AdoptionStatus.AVAILABLE,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;

    return {
      pets,
      totalCount,
      page,
      limit,
      hasNextPage,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({ where: { id } });
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async update(id: number, updatePetInput: UpdatePetInput): Promise<Pet> {
    const { id: _, ...updateData } = updatePetInput;
    await this.petsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.petsRepository.delete(id);
    return result.affected > 0;
  }

  async updateAdoptionStatus(id: number, status: AdoptionStatus): Promise<Pet> {
    await this.petsRepository.update(id, { adoptionStatus: status });
    return this.findOne(id);
  }
}