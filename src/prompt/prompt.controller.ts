import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';

@ApiTags('Prompt')
@Controller('prompt')
@UseGuards(AuthGuard('firebase-jwt'))
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Post()
  @ApiOperation({ summary: 'Create an new Prompt' })
  @ApiResponse({ status: 201, description: 'Prompt created successfully.' })
  @ApiBearerAuth()
  create(@Body() createPromptDto: CreatePromptDto, @GetUser() userInfo) {
    return this.promptService.create(userInfo.uid, createPromptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users Prompts' })
  @ApiResponse({ status: 201, description: 'list fetched.' })
  @ApiBearerAuth()
  findAll(@GetUser() userInfo) {
    return this.promptService.findAll(userInfo.uid);
  }

  @Get('/favorite')
  @ApiOperation({ summary: "Get all user's favorite Prompts" })
  @ApiResponse({ status: 201, description: 'list fetched.' })
  @ApiBearerAuth()
  async findFavorites(@GetUser() userInfo) {
    const prompts = await this.promptService.findAll(userInfo.uid);
    const data = [];
    prompts.forEach((item, index) => {
      if (item.isFavorite) {
        data.push({
          ...item,
          index,
        });
      }
    });
    return data;
  }

  @Get(':index')
  @ApiOperation({ summary: 'Get single users Prompt by index' })
  @ApiResponse({ status: 201, description: 'prompt fetched' })
  @ApiBearerAuth()
  findOne(@GetUser() userInfo, @Param('index') index: string) {
    return this.promptService.findOne(userInfo.uid, +index);
  }

  @Patch(':index')
  @ApiOperation({ summary: 'update users Prompt' })
  @ApiResponse({
    status: 201,
    description: "user's prompt updated successfully",
  })
  @ApiBearerAuth()
  update(
    @GetUser() userInfo,
    @Param('index') index: string,
    @Body() updatePromptDto: UpdatePromptDto,
  ) {
    console.log(updatePromptDto, index);
    return this.promptService.update(userInfo.uid, +index, updatePromptDto);
  }

  @Delete(':index')
  @ApiOperation({ summary: 'delete users Prompt' })
  @ApiResponse({
    status: 201,
    description: "user's prompt deleted successfully",
  })
  @ApiBearerAuth()
  remove(@GetUser() userInfo, @Param('index') index: string): Promise<number> {
    return this.promptService.remove(userInfo.uid, +index);
  }
}
