import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BoardMemberGuard } from '../../auth/boardusers.guard';

@ApiTags('Tags')
@UseGuards(BoardMemberGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiQuery({name: "boardId", required:true, description: "number"})
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }


  @Get('inquire/:cardId')
  @ApiQuery({name: "boardId", required:true, description: "number"})
  @ApiParam({name: "cardId", required:true,})
  findAllByCardId(@Param('cardId') cardId: string) {
    return this.tagsService.findAllByCardId(+cardId);
  }

  @Patch(':tagId')
  @ApiQuery({name: "boardId", required:true, description: "number"})
  @ApiParam({name: "tagId", required:true, description: "number"})
  update(@Param('tagId') tagId: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+tagId, updateTagDto);
  }

  @Delete(':tagId')
  @ApiQuery({name: "boardId", required:true, description: "number"})
  remove(@Param('tagId') id: string) {
    return this.tagsService.remove(+id);
  }
}
