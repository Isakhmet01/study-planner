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
  isPaused: boolean = false;

  editingTaskId: number | null = null;

  selectedTask: Task | null = null;
  workMinutes: number = 25;
  relaxMinutes: number = 5;
  timerDisplay: string = '25:00';
  isWorking: boolean = true;
  timerRunning: boolean = false;
  private timerInterval: any;
  remainingSeconds: number = 25 * 60;

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

    setInterval(() => {
      this.tasks = [...this.tasks];
    }, 1000);
  }

  ngOnDestroy() {
    this.stopTimer();
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
    this.taskService.addTask({
      ...this.newTask,
      subject: Number(this.newTask.subject)
    }).subscribe(() => {
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
    return new Date(deadline).getTime() < new Date().getTime();
  }

  getTimeLeft(deadline: string): string {
    const now = new Date().getTime();
    const end = new Date(deadline).getTime();
    const diff = end - now;

    if (diff <= 0) {
      return 'Expired';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  openTaskModal(task: Task) {
    this.selectedTask = task;
    this.workMinutes = 25;
    this.relaxMinutes = 5;
    this.isWorking = true;
    this.timerRunning = false;
    this.remainingSeconds = this.workMinutes * 60;
    this.updateTimerDisplay();
  }

  closeTaskModal() {
    this.selectedTask = null;
    this.timerRunning = false;
    this.isPaused = false;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  startWork() {
    this.isWorking = true;
    this.isPaused = false;
    this.remainingSeconds = this.workMinutes * 60;
    this.updateTimerDisplay();
    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timerRunning = true;

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
      } else {
        if (this.isWorking) {
          this.isWorking = false;
          this.remainingSeconds = this.relaxMinutes * 60;
          this.updateTimerDisplay();
        } else {
          this.stopTimer();
          alert('Pomodoro finished!');
        }
      }
    }, 1000);
  }

  stopTimer() {
    this.timerRunning = false;
    this.isPaused = true;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resumeTimer() {
    if (this.remainingSeconds > 0) {
      this.isPaused = false;
      this.startTimer();
    }
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    this.timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}