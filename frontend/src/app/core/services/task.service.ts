import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { ITaskService } from '../interfaces/task-service.interface';


@Injectable({
    providedIn: 'root'
})
export class TaskService implements ITaskService {
    private apiUrl = 'http://localhost:8080/api/tasks';

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    getTaskById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${id}`);
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(id: number, task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
    }

    deleteTask(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    }
}