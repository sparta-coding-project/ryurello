import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Catalog } from 'src/entities/catalogs.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>,
  ) {}

  async createCatalog(title: string, sequence: number, boardId: number) {
    await this.catalogRepository.save({
      title,
      sequence,
      boardId,
    });

    return { message: `${boardId}의 ${title} category가 생성되었습니다.` };
  }

  async getOneCatalog(catalogId: number) {
    return await this.catalogRepository.findBy({ catalogId: catalogId });
  }
}
