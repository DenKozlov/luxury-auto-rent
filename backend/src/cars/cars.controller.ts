import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseInterceptors,
  UploadedFiles,
  Query,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateCarExample } from './constants/car-examples.mock';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('cars')
export class CarsController {
  constructor(
    @Inject(CarsService)
    private readonly carsService: CarsService,
  ) {}

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
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        brand: { type: 'string' },
        model: { type: 'string' },
        year: { type: 'integer' },
        mileage_km: { type: 'integer' },
        color: { type: 'string' },
        interior_material: { type: 'string' },
        price_per_day_pln: { type: 'number' },
        is_available: { type: 'boolean' },
        engine: {
          type: 'string',
          description:
            'JSON string: {"type": "diesel", "volume": "3.0", "power_hp": 340}',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: [
        'brand',
        'model',
        'year',
        'mileage_km',
        'color',
        'interior_material',
        'is_available',
        'engine',
      ],
    },
  })
  create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.carsService.create(createCarDto, files);
  }

  @ApiOperation({ summary: 'Fetch all available cars' })
  @ApiResponse({
    status: 200,
    description: 'List of cars fetched successfully',
    type: CreateCarDto,
    isArray: true,
  })
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.carsService.findAll({ page, limit });
  }

  @ApiOperation({ summary: 'Fetch car by id' })
  @ApiResponse({
    status: 200,
    description: 'Car fetched successfully',
    type: CreateCarDto,
  })
  @Get('details/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
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

  @Delete()
  removeAll() {
    return this.carsService.removeAll();
  }

  @Post('/bulk')
  createMany(@Body() createCarDtos: CreateCarDto[]) {
    return this.carsService.createMany(createCarDtos);
  }

  @Get('/filters')
  async getFilters() {
    return await this.carsService.getFilters();
  }
}
