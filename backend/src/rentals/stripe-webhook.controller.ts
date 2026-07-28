import {
  Controller,
  Post,
  Req,
  Res,
  type RawBodyRequest,
  Logger,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import Stripe from 'stripe';
import { StripeService } from '@/src/rentals/stripe.service';
import { PrismaService } from '@/prisma.service';
import { publishEvent } from '@/lib/rabbit-connection';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    @Inject(StripeService) private readonly stripeService: StripeService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Post('stripe')
  @AllowAnonymous()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      event = this.stripeService.stripe.webhooks.constructEvent(
        req.rawBody!,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      this.logger.error('Webhook signature verification failed', err);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${(err as Error).message}`);
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const rentalId = session.metadata?.rentalId;

          if (!rentalId) {
            this.logger.warn(
              'checkout.session.completed without rentalId in metadata',
            );
            break;
          }

          const rental = await this.prisma.rental.update({
            where: { id: rentalId },
            data: {
              isPaid: true,
              status: 'CONFIRMED',
              stripePaymentId: session.payment_intent as string,
            },
            include: { client: true, car: true },
          });

          try {
            await publishEvent('rental_success', {
              email: rental.client.email,
              context: {
                clientName: `${rental.client.firstName} ${rental.client.lastName}`,
                carBrand: rental.car.brand,
                carModel: rental.car.model,
                startDate: rental.startDate,
                endDate: rental.endDate,
                totalPrice: rental.totalPrice,
                pickupLocation: rental.pickupLocation,
                dropoffLocation: rental.dropoffLocation,
              },
            });
          } catch (err) {
            this.logger.error(
              `Failed to publish rental_success event for rental ${rentalId}`,
              err,
            );
          }

          this.logger.log(`Rental ${rentalId} marked as paid`);
          break;
        }
        default:
          this.logger.debug(`Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      this.logger.error('Error while processing webhook event', err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Webhook handler failed');
    }

    res.status(HttpStatus.OK).json({ received: true });
  }
}
