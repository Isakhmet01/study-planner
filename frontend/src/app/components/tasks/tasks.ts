import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { SubjectService } from '../../services/subject.service';
import { Task } from '../../interfaces/task';
import { Subject } from '../../interfaces/subject';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  imports: [FormsModule, CommonModule]
})
export class Tasks {
  tasks: Task[] = [];
  subjects: Subject[] = [];
  selectedSubjectId: number = 0;

  editingTaskId: number | null = null;

  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    deadline: '',
    subject: 0,
    completed: false
  };

  editTask: Task = {
    id: 0,
    title: '',
    description: '',
    deadline: '',
    subject: 0,
    completed: false
  };

  constructor(
    private taskService: TaskService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadSubjects();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  loadSubjects() {
    this.subjectService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  addTask() {
    this.taskService.addTask(this.newTask).subscribe(() => {
      this.newTask = {
        id: 0,
        title: '',
        description: '',
        deadline: '',
        subject: 0,
        completed: false
      };
      this.loadTasks();
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  toggleCompleted(task: Task) {
    const updatedTask: Task = {
      ...task,
      completed: !task.completed
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe(() => {
      this.loadTasks();
    });
  }

  startEdit(task: Task) {
    this.editingTaskId = task.id;
    this.editTask = { ...task };
  }

  saveEdit() {
    if (this.editingTaskId === null) return;

    this.taskService.updateTask(this.editingTaskId, this.editTask).subscribe(() => {
      this.editingTaskId = null;
      this.loadTasks();
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown subject';
  }

  getFilteredTasks() {
    if (this.selectedSubjectId === 0) {
      return this.tasks;
    }
    return this.tasks.filter(task => task.subject === this.selectedSubjectId);
  }

  isOverdue(deadline: string): boolean {
    const today = new Date();
    const taskDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }
}
