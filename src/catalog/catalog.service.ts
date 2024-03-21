import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return await this.catalogRepository.findOneBy({ catalogId: catalogId });
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

    /* 변경된 인덱스를 각 catalog의 sequence에 반영하여 수정*/

    for (let i = 0; i < catalogs.length; i++) {
      const iId = catalogs[i].catalogId;

      const iIndex = catalogs.indexOf(catalogs[i]);

      await this.catalogRepository.update(
        {
          catalogId: iId,
        },
        { sequence: iIndex + 1 },
      );
    }

    await this.catalogRepository.find({
      where: {
        board_id: catalog.board_id,
      },
    });

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
    return { message: '해당 catalog가 삭제되었습니다.' };
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

  /* sequence 정렬하는 함수 */
  // private async sortSequence(boardId: number) {
  //   const catalogs = await this.catalogRepository.findBy({ board_id: boardId });
  // }
}
