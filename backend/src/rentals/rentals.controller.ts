import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { RentalsService } from '@/src/rentals/rentals.service';
import { ClientDto } from '../clients/dto/client.dto';
import { RentalDto } from './dto/rental.dto';

@Controller('rentals')
export class RentalsController {
  constructor(
    @Inject(RentalsService) private readonly rentalsService: RentalsService,
  ) {}

  @Post('/checkout')
  @AllowAnonymous()
  async create(
    @Body() { client, rental }: { client: ClientDto; rental: RentalDto },
  ) {
    return await this.rentalsService.createCheckout(client, rental);
  }
}
