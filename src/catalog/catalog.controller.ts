import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async findAll() {
    return await this.catalogService.findAll();
  }

  @Post()
  async update(@Body() catalogDTO: CatalogDto) {
    await this.catalogService.createCatalog(catalogDto.catalog);
  }
}
