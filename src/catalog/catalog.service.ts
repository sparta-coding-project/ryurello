import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Catalog } from 'src/entities/catalogs.entity';
import { Board } from 'src/entities/boards.entity';

import _ from 'lodash';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>,
  ) {}

  /* catalog 생성 */
  async createCatalog(title: string, sequence: number, boardId: number) {
    const board = await this.boardRepository.findOneBy({ boardId });

    if (_.isNil(board)) {
      throw new NotFoundException('board를 찾을 수 없습니다.');
    }

    await this.catalogRepository.save({
      board,
      title,
      sequence,
    });

    return { message: `${boardId}의 ${title} catalog가 생성되었습니다.` };
  }

  /* catalog 전체 조회 */
  // async getCatalogs(boardId: number) {
  //   return await this.catalogRepository.find(where:{},include:{});
  // }

  /* catalog 단일 조회 */
  async getOneCatalog(catalogId: number) {
    return await this.catalogRepository.findOneBy({ catalogId: catalogId });
  }
  /* catalog 제목 수정 */
  async updateCatalogTitle(catalogId: number, title: string) {
    const catalog = await this.catalogRepository.findOneBy({
      catalogId: catalogId,
    });
    if (_.isNil(catalog)) {
      throw new NotFoundException('해당 catalog를 찾을 수 없습니다.');
    }
    await this.catalogRepository.update({ catalogId }, { title });
  }

  /* catalog 순서 변경 */
  async updateCatalogSequence(catalogId: number, sequence: number) {
    const catalog = await this.catalogRepository.findOneBy({
      catalogId: catalogId,
    });
    if (_.isNil(catalog)) {
      throw new NotFoundException('해당 catalog를 찾을 수 없습니다.');
    }
    const board = catalog.board;

    const catalogs = await this.catalogRepository.findBy({ board });
    console.log(catalogs);
    catalogs.splice(sequence - 1, 0, catalog);
    const changedCatalogs = catalogs.map((c) => {
      // if (c.sequence - 1 !== catalogs.indexOf(c)) {
      //   await this.catalogRepository.update({c.catalogId},{})
      // }
      console.log(c);
    });
  }
  /* catalog 삭제 */
  async deleteCatalog(catalogId: number) {
    const catalog = await this.catalogRepository.findOneBy({
      catalogId: catalogId,
    });
    if (_.isNil(catalog)) {
      throw new NotFoundException('해당 catalog를 찾을 수 없습니다.');
    }
    await this.catalogRepository.delete({ catalogId });
    return { message: '해당 catalog가 삭제되었습니다.' };
  }
}
