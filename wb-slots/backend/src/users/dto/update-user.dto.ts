import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'Иван Петров', description: 'Новое имя пользователя', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+79009876543', description: 'Новый номер телефона', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
