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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Задачи')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой задачи' })
  @ApiResponse({ status: 201, description: 'Задача создана' })
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех задач пользователя' })
  @ApiResponse({ status: 200, description: 'Список задач' })
  async findAll(@Request() req) {
    return this.tasksService.findAll(req.user.sub);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получение статистики задач пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика задач' })
  async getStats(@Request() req) {
    return this.tasksService.getTaskStats(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение задачи по ID' })
  @ApiResponse({ status: 200, description: 'Данные задачи' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление задачи' })
  @ApiResponse({ status: 200, description: 'Задача обновлена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.sub, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiResponse({ status: 200, description: 'Задача удалена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.tasksService.remove(id, req.user.sub);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Запуск задачи' })
  @ApiResponse({ status: 201, description: 'Задача запущена' })
  @ApiResponse({ status: 404, description: 'Задача не найдена' })
  async runTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.runTask(id, req.user.sub);
  }
}
