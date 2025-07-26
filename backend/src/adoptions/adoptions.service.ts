import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adoption, PaymentStatus } from './adoption.entity';
import { CreateAdoptionInput } from './dto/create-adoption.input';
import { PetsService } from '../pets/pets.service';
import { AdoptionStatus } from '../pets/pet.entity';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption)
    private adoptionsRepository: Repository<Adoption>,
    private petsService: PetsService,
  ) {}

  async create(createAdoptionInput: CreateAdoptionInput): Promise<Adoption> {
    const pet = await this.petsService.findOne(createAdoptionInput.petId);
    
    if (pet.adoptionStatus !== AdoptionStatus.AVAILABLE) {
      throw new BadRequestException('This pet is not available for adoption');
    }

    await this.petsService.updateAdoptionStatus(pet.id, AdoptionStatus.PENDING);

    const adoption = this.adoptionsRepository.create({
      ...createAdoptionInput,
      adoptionFee: pet.adoptionFee,
    });

    return await this.adoptionsRepository.save(adoption);
  }

  async findAll(): Promise<Adoption[]> {
    return await this.adoptionsRepository.find({
      relations: ['pet'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Adoption> {
    return await this.adoptionsRepository.findOne({
      where: { id },
      relations: ['pet'],
    });
  }

  async processPayment(id: string): Promise<Adoption> {
    const adoption = await this.findOne(id);
    
    adoption.paymentStatus = PaymentStatus.COMPLETED;
    await this.adoptionsRepository.save(adoption);

    await this.petsService.updateAdoptionStatus(
      adoption.petId,
      AdoptionStatus.ADOPTED,
    );

    return adoption;
  }

}