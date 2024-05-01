import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePromptDto } from './create-prompt.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePromptDto extends PartialType(CreatePromptDto) {
  @ApiProperty({ description: 'set isFavorite property' })
  @IsOptional()
  @IsBoolean()
  isFavorite: boolean = false;
}
