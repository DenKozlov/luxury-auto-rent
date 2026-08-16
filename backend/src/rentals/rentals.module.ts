import { Module } from '@nestjs/common';
import { RentalsController } from '@/src/rentals/rentals.controller';
import { RentalsService } from '@/src/rentals/rentals.service';
import { StripeService } from '@/src/rentals/stripe.service';
import { StripeWebhookController } from '@/src/rentals/stripe-webhook.controller';

@Module({
  controllers: [RentalsController, StripeWebhookController],
  providers: [RentalsService, StripeService],
})
export class RentalsModule {}
