import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api = 'http://127.0.0.1:8000/api/tasks/';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }


  addTask(data: Task): Observable<Task> {
    return this.http.post<Task>(this.api, data);
  }

  updateTask(id: number, data: Task): Observable<Task> {
    return this.http.put<Task>(this.api + id + '/', data);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(this.api + id + '/');
  }
}
