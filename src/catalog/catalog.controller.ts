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

  @Get('get/:catalogId')
  async findOneCatalog(
    @Param('catalogId')
    catalogId: number,
  ) {
    return await this.catalogService.getOneCatalog(catalogId);
  }

  @Post('create/:boardId')
  async createCatalog(
    @Param('boardId') boardId: number,
    @Body() catalogDto: CatalogDto,
  ) {
    return this.catalogService.createCatalog(catalogDto.title, boardId);
  }

  @Patch('updateTitle/:catalogId')
  async updateCatalogTitle(
    @Param('catalogId')
    catalogId: number,
    @Body('updateTitle') updateTitle: string,
  ) {
    await this.catalogService.updateCatalogTitle(catalogId, updateTitle);
    return { message: `'${updateTitle}'로 title이 변경되었습니다.` };
  }

  @Patch('updateSequence/:catalogId')
  async updateCatalogSequence(
    @Param('catalogId')
    catalogId: number,
    @Body('updateSequence') updateSequence: number,
  ) {
    return this.catalogService.updateCatalogSequence(catalogId, updateSequence);
  }

  @Delete('delete/:catalogId')
  async deleteCatalog(@Param('catalogId') catalogId: number) {
    return this.catalogService.deleteCatalog(catalogId);
  }
}
