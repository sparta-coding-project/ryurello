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
  async createCatalog(title: string, sequence: number, boardId: number) {
    const isDuplicatedSequence = await this.checkSequence(boardId);

    if (isDuplicatedSequence) {
      throw new BadRequestException(
        '순서가 중복되니 sequence를 다른 수로 입력하세요',
      );
    }
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
    const result = await this.catalogRepository.findOneBy({
      catalogId: catalogId,
    });
    return { result };
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
    console.log(catalogs);

    catalogs.splice(originSequence - 1, 1);
    catalogs.splice(sequence - 1, 0, catalog);
    console.log('           ↑ 변경 전           ');
    console.log('//////////////////////////////////////////');
    console.log('           ↓ 변경 후');
    console.log(catalogs);

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    /* 바뀐 위치들에 맞게 각자의 인덱스를 수정한다 */
    // const changedCatalogs = catalogs.map(async function (c) {
    //   // 배열 인덱스 +1과 sequence가 같지 않으면 sequence를 배열 인덱스 +1로 변경
    //   const cIndex = catalogs.indexOf(c);
    //   console.log(c.sequence);
    //   console.log(cIndex);

    //   catalogId = c.catalogId;

    //   await this.changeSequence(catalogId, cIndex);
    // });
    for (let i = 0; i < catalogs.length; i++) {
      const iId = catalogs[i].catalogId;
      console.log(iId);
      const iIndex = catalogs.indexOf(catalogs[i]);
      await this.catalogRepository.update(
        {
          catalogId: iId,
        },
        { sequence: iIndex + 1 },
      );

      const newCatalogs = await this.catalogRepository.find({
        where: {
          board_id: catalog.board_id,
        },
      });

      console.log(newCatalogs);
    }
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
}
