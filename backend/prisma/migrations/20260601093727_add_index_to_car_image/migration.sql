-- CreateTable
CREATE TABLE "CarImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "carId" TEXT NOT NULL,

    CONSTRAINT "CarImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarImage" ADD CONSTRAINT "CarImage_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;
