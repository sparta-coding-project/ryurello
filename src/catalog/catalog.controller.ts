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

  @Get()
  async findAll() {
    return await this.catalogService.getAll();
  }

  @Post()
  async createCatalog(@Body() catalogDto: CatalogDto) {
    await this.catalogService.createCatalog(
      catalogDto.title,
      catalogDto.sequence,
    );
  }

  @Patch()
  async updateCatalog(
    @Param('catalogId') catalogId: number,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    await this.catalogService.updateCatalog(
      catalogId,
      updateCatalogDto.title,
      updateCatalogDto.sequence,
    );
  }

  @Delete()
  async deleteCatalog(@Param('catalogId') catalogId: number) {
    return this.catalogService.deleteCatalog(catalogId);
  }
}
