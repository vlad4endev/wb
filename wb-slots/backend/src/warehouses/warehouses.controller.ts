import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Склады')
@Controller('warehouses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @ApiOperation({ summary: 'Добавление склада' })
  @ApiResponse({ status: 201, description: 'Склад добавлен' })
  async create(@Request() req, @Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehousesService.create(req.user.sub, createWarehouseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех складов пользователя' })
  @ApiResponse({ status: 200, description: 'Список складов' })
  async findAll(@Request() req) {
    return this.warehousesService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение склада по ID' })
  @ApiResponse({ status: 200, description: 'Данные склада' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.warehousesService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление склада' })
  @ApiResponse({ status: 200, description: 'Склад обновлен' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehousesService.update(id, req.user.sub, updateWarehouseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление склада' })
  @ApiResponse({ status: 200, description: 'Склад удален' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.warehousesService.remove(id, req.user.sub);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Переключение активности склада' })
  @ApiResponse({ status: 200, description: 'Статус склада изменен' })
  @ApiResponse({ status: 404, description: 'Склад не найден' })
  async toggleActive(@Param('id') id: string, @Request() req) {
    return this.warehousesService.toggleActive(id, req.user.sub);
  }
}
