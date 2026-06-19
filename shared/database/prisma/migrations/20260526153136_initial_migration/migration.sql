-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE');

-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage_km" INTEGER NOT NULL,
    "body_type" "BodyType" NOT NULL,
    "engine" JSONB NOT NULL,
    "color" TEXT NOT NULL,
    "interior_material" TEXT NOT NULL,
    "price_per_day_pln" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
