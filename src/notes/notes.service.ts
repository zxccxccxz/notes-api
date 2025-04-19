import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteDto } from './dto/note.dto';
import { NoteListDto } from './dto/note-list.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  private readonly notes: NoteDto[] = [];

  create(createNoteDto: CreateNoteDto): NoteDto {
    const newNote: NoteDto = {
      id: uuidv4(),
      title: createNoteDto.title,
      content: createNoteDto.content || '',
    };
    this.notes.push(newNote);
    console.log(`Note created: ${JSON.stringify(newNote)}`);
    console.log(`Current notes: ${JSON.stringify(this.notes)}`);
    return newNote;
  }

  findAll(): NoteListDto {
    console.log(`Finding all notes. Count: ${this.notes.length}`);
    return { items: this.notes };
  }

  findOne(id: string): NoteDto {
    console.log(`Finding note with id: ${id}`);
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      console.error(`Note with id ${id} not found.`);
      throw new NotFoundException(`Note with id "${id}"  not found.`);
    }
    console.log(`Note found: ${JSON.stringify(note)}`);
    return note;
  }

  update(id: string, updateNoteDto: UpdateNoteDto): NoteDto {
    console.log(
      `Updating note with id: ${id}, data: ${JSON.stringify(updateNoteDto)}`,
    );
    const note = this.findOne(id);
    const noteIndex = this.notes.findIndex((n) => n.id === id);

    const updatedNote = { ...note };
    if (updateNoteDto.title !== undefined) {
      updatedNote.title = updateNoteDto.title;
    }
    if (updateNoteDto.content !== undefined) {
      updatedNote.content = updateNoteDto.content;
    }

    this.notes[noteIndex] = updatedNote;
    console.log(`Note updated: ${JSON.stringify(updatedNote)}`);
    return updatedNote;
  }

  remove(id: string): { success: boolean } {
    console.log(`Removing note with id: ${id}`);
    const noteIndex = this.notes.findIndex((n) => n.id === id);
    if (noteIndex === -1) {
      console.error(`Note with id ${id} not found for removal.`);
      throw new NotFoundException(
        `Note with id  "${id}" not found for removal`,
      );
    }
    this.notes.splice(noteIndex, 1);
    console.log(`Note removed. Current notes count: ${this.notes.length}`);
    return { success: true };
  }
}
