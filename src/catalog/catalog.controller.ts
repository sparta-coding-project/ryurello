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
import { UpdateCatalogDto } from './dto/updateCatalog.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('get/:catalogId')
  async findOneCatalog(@Param('categoryId') categoryId: number) {
    return await this.catalogService.getOneCatalog(categoryId);
  }

  @Post('create/:boardId')
  async createCatalog(
    @Param('boardId') boardId: number,
    @Body() catalogDto: CatalogDto,
  ) {
    return this.catalogService.createCatalog(
      catalogDto.title,
      catalogDto.sequence,
      boardId,
    );
  }

  @Patch('updateTitle/:catalogId')
  async updateCatalogTitle(
    @Param('catalogId')
    catalogId: number,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    return this.catalogService.updateCatalogTitle(
      catalogId,
      updateCatalogDto.title,
    );
  }

  @Patch('updateSequence/:catalogId')
  async updateCatalogSequence(
    @Param('catalogId')
    catalogId: number,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    return this.catalogService.updateCatalogSequence(
      catalogId,
      updateCatalogDto.sequence,
    );
  }

  @Delete('delete/:catalogId')
  async deleteCatalog(@Param('catalogId') catalogId: number) {
    return this.catalogService.deleteCatalog(catalogId);
  }
}
