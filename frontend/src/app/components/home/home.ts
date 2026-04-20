import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { SubjectService } from '../../services/subject.service';
import { Task } from '../../interfaces/task';
import { Subject } from '../../interfaces/subject';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  tasks: Task[] = [];
  subjects: Subject[] = [];
  groupedTasks: { [key: string]: Task[] } = {};

  intervalId: any;

  constructor(
    private taskService: TaskService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    this.loadData();

    this.intervalId = setInterval(() => {
      this.loadData();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadData() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      this.groupTasks();
    });

    this.subjectService.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  groupTasks() {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const daysMap: { [key: string]: Task[] } = {};

    this.tasks.forEach(task => {
      if (task.completed) return;

      const date = new Date(task.deadline);
      const dayIndex = date.getDay();
      const day = daysOrder[(dayIndex + 6) % 7];

      if (!daysMap[day]) {
        daysMap[day] = [];
      }

      daysMap[day].push(task);
    });

    for (let day in daysMap) {
      daysMap[day].sort((a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    }

    const sortedMap: { [key: string]: Task[] } = {};
    daysOrder.forEach(day => {
      sortedMap[day] = daysMap[day] || [];
    });

    this.groupedTasks = sortedMap;
  }

  getDays(): string[] {
    return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  }

  getSubjectName(subjectId: number): string {
    const subject = this.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown';
  }

  formatDeadline(deadline: string): string {
    const date = new Date(deadline);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}  ${hours}:${minutes}`;
  }

  isOverdue(deadline: string): boolean {
    return new Date(deadline).getTime() < new Date().getTime();
  }
}
