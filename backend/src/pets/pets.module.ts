import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { PetsService } from './pets.service';
import { PetsResolver } from './pets.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Pet])],
  providers: [PetsResolver, PetsService],
  exports: [PetsService],
})
export class PetsModule {}