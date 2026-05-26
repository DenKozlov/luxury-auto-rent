import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateCarExample } from './constants/car-examples.mock';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @ApiOperation({ summary: 'Add new car to the list' })
  @ApiResponse({
    status: 201,
    description: 'New car added successfully',
    type: CreateCarDto,
  })
  @ApiBody({
    type: CreateCarDto,
    examples: {
      validCar: {
        summary: 'Valid car data example',
        value: CreateCarExample,
      },
    },
  })
  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @ApiOperation({ summary: 'Fetch all available cars' })
  @ApiResponse({
    status: 200,
    description: 'List of cars fetched successfully',
    type: CreateCarDto,
    isArray: true,
  })
  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @ApiOperation({ summary: 'Fetch car by id' })
  @ApiResponse({
    status: 200,
    description: 'Car fetched successfully',
    type: CreateCarDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update car by id' })
  @ApiResponse({
    status: 200,
    description: 'Car updated successfully',
    type: CreateCarDto,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @ApiOperation({ summary: 'Delete car by id' })
  @ApiResponse({
    status: 204,
    description: 'Car deleted successfully',
    type: CreateCarDto,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
