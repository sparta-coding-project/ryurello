import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, createQueryBuilder } from 'typeorm';
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
  async createCatalog(title: string, boardId: number) {
    const board = await this.boardRepository.findOneBy({ boardId });

    if (_.isNil(board)) {
      throw new NotFoundException('board를 찾을 수 없습니다.');
    }

    const catalogs = await this.catalogRepository.findBy({
      board_id: boardId,
    });

    const catalogsLength = catalogs.length;

    const isDuplicatedSequence = await this.checkSequence(boardId);

    if (isDuplicatedSequence) {
      throw new BadRequestException(
        '순서가 중복되니 sequence를 다른 수로 입력하세요',
      );
    }

    await this.catalogRepository.save({
      board,
      title,
      sequence: catalogsLength + 1,
    });

    return { message: `${boardId}의 ${title} catalog가 생성되었습니다.` };
  }

  /* catalog 단일 조회 */
  async getOneCatalog(catalogId: number) {
    return await this.catalogRepository.findOne({
      where: { catalogId: catalogId },
      relations: ['cards'],
    });
  }

  async getCatalogs(boardId: number) {
    return await this.catalogRepository
      .createQueryBuilder('catalog')
      .leftJoinAndSelect('catalog.cards', 'cards')
      .orderBy('catalog.sequence', 'ASC')
      .addOrderBy('cards.sequence', 'ASC')
      .where('catalog.board_id = :boardId', { boardId })
      .getMany();
  }

  /* catalog 제목 수정 */
  async updateCatalogTitle(catalogId: number, title: string) {
    const catalog = await this.catalogRepository.findOneBy({
      catalogId,
    });
    if (_.isNil(catalog)) {
      throw new NotFoundException('해당 catalog를 찾을 수 없습니다.');
    }
    await this.catalogRepository.update({ catalogId }, { title });

    return { message: 'catalog의 제목이 수정되었습니다.' };
  }

  /* catalog 순서 변경 */
  async updateCatalogSequence(catalogId: number, sequence: number) {
    const catalog = await this.catalogRepository.findOneBy({
      catalogId: catalogId,
    });

    if (_.isNil(catalog)) {
      throw new NotFoundException('해당 catalog를 찾을 수 없습니다.');
    }

    const originSequence = catalog.sequence;

    const catalogs = await this.catalogRepository.find({
      where: {
        board_id: catalog.board_id,
      },
    });

    /* 목적 catalog의 위치를 먼저 바꾼다 */

    catalogs.splice(originSequence - 1, 1);

    catalogs.splice(sequence - 1, 0, catalog);

    for (let i = 0; i < catalogs.length; i++) {
      const iId = catalogs[i].catalogId;

      await this.catalogRepository.update(
        {
          catalogId: iId,
        },
        { sequence: i + 1 },
      );
    }

    return { message: '순서 수정이 완료되었습니다.' };
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

    const boardId = catalog.board_id;

    await this.sortSequence(boardId);

    return { message: '해당 catalog가 삭제되었습니다.' };
  }

  private async sortSequence(boardId: number) {
    // catalog들 가져오기
    // catalog들 sequence를 배열 인덱스에 맞게 수정하기
    const catalogs = await this.catalogRepository.find({
      where: {
        board_id: boardId,
      },
    });

    for (let i = 0; i < catalogs.length; i++) {
      const iId = catalogs[i].catalogId;

      await this.catalogRepository.update(
        {
          catalogId: iId,
        },
        { sequence: i + 1 },
      );
    }
  }

  /* create할 때 sequence가 중복되는지 확인하는 함수*/
  private async checkSequence(boardId: number) {
    // 보드아이디로 카탈로그들 find로 찾기
    const catalogs = await this.catalogRepository.findBy({ board_id: boardId });

    // sequence 중복 체크 후 중복이면 true, 중복이 없으면 false 반환
    const isDup = catalogs.some((x) => {
      return catalogs.indexOf(x) !== catalogs.lastIndexOf(x);
    });

    return isDup;
  }
}
