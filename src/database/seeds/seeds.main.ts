import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './seeds.module';
import { SeedsService } from './seeds.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);

  try {
    const seedService = app.get(SeedsService);

    console.log(await seedService.generateUserAccessTableContent());
    console.log(await seedService.generateUserStatusTableContent());
    console.log(await seedService.generateRequirementTypeTableContent());
  } catch (error) {
    console.log('Seed Service Failed: ' + error.code);
  }

  await app.close();
}

bootstrap(); // npm run seed:run
