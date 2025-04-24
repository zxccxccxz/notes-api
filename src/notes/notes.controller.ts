import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteDto } from './dto/note.dto';
import { NoteListDto } from './dto/note-list.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): NoteListDto {
    return this.notesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoteDto: CreateNoteDto): NoteDto {
    return this.notesService.create(createNoteDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): NoteDto {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): NoteDto {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string): {
    success: boolean;
  } {
    return this.notesService.remove(id);
  }
}
