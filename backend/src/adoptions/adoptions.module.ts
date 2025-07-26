import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adoption } from './adoption.entity';
import { AdoptionsService } from './adoptions.service';
import { AdoptionsResolver } from './adoptions.resolver';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Adoption]), PetsModule],
  providers: [AdoptionsResolver, AdoptionsService],
})
export class AdoptionsModule {}