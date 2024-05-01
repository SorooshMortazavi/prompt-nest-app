import { Injectable } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { IPrompt } from './interfaces/IPrompt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PromptService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async create(userId: string, createPromptDto: CreatePromptDto) {
    const promptData: IPrompt = {
      ...createPromptDto,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: uuidv4(),
      status: 'active',
      isFavorite: false,
    };
    await this.redisClient.rpush(
      `user:${userId}:prompts`,
      JSON.stringify(promptData),
    );
    return promptData;
  }

  async findAll(userId: string): Promise<IPrompt[]> {
    const data = await this.redisClient.lrange(`user:${userId}:prompts`, 0, -1);
    if (data.length > 0) {
      return data.map((item) => {
        return JSON.parse(item);
      });
    }
    return [];
  }

  async findOne(userId: string, index: number | string) {
    const data = await this.redisClient.lindex(`user:${userId}:prompts`, index);
    if (data) {
      return JSON.parse(data);
    }
    return data;
  }

  async update(
    userId: string,
    index: number,
    updatePromptDto: UpdatePromptDto,
  ) {
    let data: string | object = await this.redisClient.lindex(
      `user:${userId}:prompts`,
      index,
    );
    if (data) {
      data = JSON.parse(data) as object;
      data = {
        ...data,
        ...updatePromptDto,
      };
      return await this.redisClient.lset(
        `user:${userId}:prompts`,
        index,
        JSON.stringify(data),
      );
    }
    return false;
  }

  async remove(userId: string, index: number): Promise<number> {
    const data = await this.redisClient.lindex(`user:${userId}:prompts`, index);
    return await this.redisClient.lrem(`user:${userId}:prompts`, 1, data);
  }
}
