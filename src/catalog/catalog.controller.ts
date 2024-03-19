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

  @Patch('update/:boardId/:catalogId')
  async updateCatalog(
    @Param('boardId,catalogId') boardId: number,
    catalogId: number,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    return this.catalogService.updateCatalog(
      catalogId,
      updateCatalogDto.title,
      updateCatalogDto.sequence,
      boardId,
    );
  }

  @Delete('delete/:catalogId')
  async deleteCatalog(@Param('catalogId') catalogId: number) {
    return this.catalogService.deleteCatalog(catalogId);
  }
}
