import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
export class CreatePromptDto {
  @ApiProperty({ description: 'the title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the description' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Array of Categories',
    example: ['someCategory', 'otherCategory'],
  })
  @IsArray()
  @IsString({ each: true })
  category: string[];
}
