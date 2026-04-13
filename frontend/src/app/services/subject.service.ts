import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from '../interfaces/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://127.0.0.1:8000/api/subjects/';

  private api = 'http://127.0.0.1:8000/api/subjects/';

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  addSubject(subject: Subject): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, subject);
  }

  deleteSubject(id: number) {
    return this.http.delete(this.api + id + '/');
  }
  updateSubject(id: number, data: any) {
    return this.http.put(this.api + id + '/update/', data);
  }
}
