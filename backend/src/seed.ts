import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PetsService } from './pets/pets.service';
import { SEED_PETS } from './seed-data';
import { PetSpecies, PetGender } from './pets/pet.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const petsService = app.get(PetsService);

  console.log('Seeding database with pets...');

  for (const petData of SEED_PETS) {
    try {
      const pet = await petsService.create({
        ...petData,
        species: petData.species as PetSpecies,
        gender: petData.gender as PetGender,
      });
      console.log(`Created pet: ${pet.name}`);
    } catch (error) {
      console.error(`Error creating pet ${petData.name}:`, error.message);
    }
  }

  console.log('Seeding complete!');
  await app.close();
}

bootstrap();