import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export interface ITaskService {
  getTasks(): Observable<Task[]>;
  getTaskById(id: number): Observable<Task>;
  createTask(task: Task): Observable<Task>;
  updateTask(id: number, task: Task): Observable<Task>;
  deleteTask(id: number): Observable<any>;
}