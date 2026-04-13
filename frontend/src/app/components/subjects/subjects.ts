import { Component } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../interfaces/subject';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects',
  standalone: true,
  templateUrl: './subjects.html',
  styleUrl: './subjects.css',
  imports: [FormsModule, CommonModule]
})
export class Subjects {
  subjects: Subject[] = [];
  newSubjectName: string = '';
  editingSubjectId: number | null = null;
  editSubjectName: string = '';

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  addSubject() {
    const subject = { id: 0, name: this.newSubjectName };
    this.subjectService.addSubject(subject).subscribe(() => {
      this.newSubjectName = '';
      this.loadSubjects();
    });
  }

  deleteSubject(id: number) {
    this.subjectService.deleteSubject(id).subscribe(() => {
      this.loadSubjects(); // қайта жаңарту
    });
  }
  startEdit(subject: any) {
    this.editingSubjectId = subject.id;
    this.editSubjectName = subject.name;
  }

  saveEdit() {
    if (this.editingSubjectId === null) return;

    this.subjectService.updateSubject(this.editingSubjectId, {
      name: this.editSubjectName
    }).subscribe(() => {
      this.editingSubjectId = null;
      this.loadSubjects();
    });
  }

  cancelEdit() {
    this.editingSubjectId = null;
  }
}
