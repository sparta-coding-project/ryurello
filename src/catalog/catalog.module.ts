import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from 'src/entities/catalogs.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Board } from 'src/entities/boards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog, Board])],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
