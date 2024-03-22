import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogDto } from './dto/catalog.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /**
   * 카탈로그 단일 조회
   * @param catalogId
   * @returns
   */
  /* 카탈로그 단일 조회 */
  @Get('getOne/:catalogId')
  async findOneCatalog(
    @Param('catalogId')
    catalogId: number,
  ) {
    const result = await this.catalogService.getOneCatalog(catalogId);
    return { result };
  }

  /**
   * 해당 보드의 카탈로그들과 카드들 조회
   * @param boardId
   * @returns
   */
  /* 해당 보드의 여러 카탈로그들 + 카드들 조회 */
  @Get('get/:boardId')
  async findCatalogs(@Param('boardId') boardId: number) {
    return await this.catalogService.getCatalogs(boardId);
  }

  /**
   * 카탈로그 생성
   * @param boardId
   * @param catalogDto
   * @returns
   */
  /* 카탈로그 생성 */
  @Post('create/:boardId')
  async createCatalog(
    @Param('boardId') boardId: number,
    @Body() catalogDto: CatalogDto,
  ) {
    return this.catalogService.createCatalog(catalogDto.title, boardId);
  }

  /**
   * 카탈로그 제목(Title) 수정
   * @param catalogId
   * @param updateTitle
   * @returns
   */
  @Patch('updateTitle/:catalogId')
  async updateCatalogTitle(
    @Param('catalogId')
    catalogId: number,
    @Body('updateTitle') updateTitle: string,
  ) {
    await this.catalogService.updateCatalogTitle(catalogId, updateTitle);
    return { message: `'${updateTitle}'로 title이 변경되었습니다.` };
  }

  /**
   * 카탈로그 순서 수정
   * @param catalogId
   * @param updateSequence
   * @returns
   */
  @Patch('updateSequence/:catalogId')
  async updateCatalogSequence(
    @Param('catalogId')
    catalogId: number,
    @Body('updateSequence') updateSequence: number,
  ) {
    return this.catalogService.updateCatalogSequence(catalogId, updateSequence);
  }

  /**
   * 카탈로그 삭제
   * @param catalogId
   * @returns
   */
  @Delete('delete/:catalogId')
  async deleteCatalog(@Param('catalogId') catalogId: number) {
    return this.catalogService.deleteCatalog(catalogId);
  }
}
