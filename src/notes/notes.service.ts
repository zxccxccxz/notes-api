import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NoteDto } from './dto/note.dto';
import { NoteListDto } from './dto/note-list.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  private mapEntityToDto(note: Note): NoteDto {
    return {
      id: note.id,
      title: note.title,
      content: note.content,
    };
  }

  async create(createNoteDto: CreateNoteDto): Promise<NoteDto> {
    const newNoteEntity = this.notesRepository.create({
      ...createNoteDto,
      content: createNoteDto.content ?? '',
    });
    const savedNote = await this.notesRepository.save(newNoteEntity);
    console.log(`Note created in DB: ${JSON.stringify(savedNote)}`);
    return this.mapEntityToDto(savedNote);
  }

  async findAll(): Promise<NoteListDto> {
    const notes = await this.notesRepository.find();
    console.log(`Finding all notes from DB. Count: ${notes.length}`);
    return { items: notes.map((note) => this.mapEntityToDto(note)) };
  }

  async findOne(id: string): Promise<NoteDto> {
    console.log(`Finding note with id: ${id} from DB`);

    const note = await this.notesRepository.findOneBy({ id });
    if (!note) {
      console.error(`Note with id ${id} not found in DB.`);
      throw new NotFoundException(`Нотатку з ID "${id}" не знайдено`);
    }
    console.log(`Note found in DB: ${JSON.stringify(note)}`);
    return this.mapEntityToDto(note);
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<NoteDto> {
    console.log(
      `Updating note with id: ${id} in DB, data: ${JSON.stringify(updateNoteDto)}`,
    );

    const note = await this.notesRepository.preload({
      id: id,
      ...updateNoteDto,
    });

    if (!note) {
      console.error(`Note with id ${id} not found for update in DB.`);
      throw new NotFoundException(
        `Note with id ${id} not found for update in DB for update.`,
      );
    }
    const updatedNote = await this.notesRepository.save(note);
    console.log(`Note updated in DB: ${JSON.stringify(updatedNote)}`);
    return this.mapEntityToDto(updatedNote);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    console.log(`Removing note with id: ${id} from DB`);
    const result = await this.notesRepository.delete(id);

    if (result.affected === 0) {
      console.error(`Note with id ${id} not found for removal in DB.`);
      throw new NotFoundException(
        `Note with id ${id} not found for removal in DB.`,
      );
    }
    console.log(`Note removed from DB. Affected rows: ${result.affected}`);
    return { success: true };
  }
}
