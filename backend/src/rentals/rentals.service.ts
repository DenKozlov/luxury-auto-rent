import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RentalDto } from '@/src/rentals/dto/rental.dto';
import { ClientDto } from '@/src/clients/dto/client.dto';
import { PrismaService } from '@/prisma.service';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

@Injectable()
export class RentalsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StripeService) private readonly stripeService: StripeService,
  ) {}

  private readonly logger = new Logger(RentalsService.name);
  async createCheckout(client: ClientDto, rental: RentalDto) {
    let clnt;
    try {
      clnt = await this.prisma.client.findUnique({
        where: { email: client.email },
      });

      if (!clnt) {
        const {
          email,
          firstName,
          lastName,
          dateOfBirth,
          driverLicenseNumber,
          phone,
        } = client;
        clnt = await this.prisma.client.create({
          data: {
            email,
            firstName,
            lastName,
            dateOfBirth,
            driverLicenseNumber,
            phone,
          },
        });
      }
    } catch (e) {
      this.logger.error('Failed to create user', e);
      throw new InternalServerErrorException('Failed to process user data');
    }

    let rntl;
    try {
      rntl = await this.prisma.rental.create({
        data: {
          ...rental,
          status: 'PENDING',
          isPaid: false,
          clientId: clnt.id,
        },
      });
    } catch (e) {
      this.logger.error('Failed to create rental order', e);
      throw new InternalServerErrorException('Failed to create rental');
    }

    let session;
    try {
      session = await this.stripeService.stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: clnt.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Car rent (${rntl.startDate} — ${rntl.endDate})`,
              },
              unit_amount: Math.round(rntl.totalPrice * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          rentalId: rntl.id,
          userId: clnt.id,
        },
        success_url: `${process.env.APP_URL}/cars/${rental.carId}?success=true`,
        cancel_url: `${process.env.APP_URL}/cars/${rental.carId}?canceled=true`,
      });
    } catch (err) {
      this.logger.error('Stripe session creation failed', err);

      await this.prisma.rental
        .update({
          where: { id: rntl.id },
          data: { status: 'FAILED' },
        })
        .catch((e) => this.logger.error('Failed to mark order as failed', e));

      if (err instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${err.message}`);
      }
      throw new InternalServerErrorException('Failed to create session');
    }
    try {
      await this.prisma.rental.update({
        where: { id: rntl.id },
        data: {
          stripeSessionId: session.id,
        },
      });
    } catch (err) {
      this.logger.error('Failed to save stripeSessionId', err);
    }

    return { redirectUrl: session.url };
  }
}
