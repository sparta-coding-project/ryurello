import { HttpException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from '../../entities/tags.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>
  ) {}
  async create(createTagDto: CreateTagDto) {
    const { cardId, title } = createTagDto;
    const tag = this.tagsRepository.findOneBy({ cardId, title });
    if (tag) {
      throw new HttpException('이미 있는 태그입니다.', 403);
    }
    return await this.tagsRepository.save(createTagDto);
  }

  async findAllByCardId(cardId: number) {
    return await this.tagsRepository.findBy({cardId})
  }

  async update(tagId: number, updateTagDto: UpdateTagDto) {
    return await this.tagsRepository.update({ tagId }, updateTagDto)
  }

  async remove(tagId: number) {
    return await this.tagsRepository.delete({tagId})
  }
}
