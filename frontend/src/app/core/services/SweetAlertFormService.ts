import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Task } from '../models/task.model';
import { TaskService } from './task.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertFormService {
  constructor(private taskService: TaskService) {}

  // Fetch all tasks with error handling
  getTasks(): Observable<Task[]> {
    return this.taskService.getTasks().pipe(
      catchError((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch tasks. Please try again later.',
          confirmButtonColor: '#3085d6',
        });
        return throwError(() => error);
      })
    );
  }

  // Fetch a single task by ID with error handling
  getTaskById(id: number): Observable<Task> {
    return this.taskService.getTaskById(id).pipe(
      catchError((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to fetch task with ID ${id}.`,
          confirmButtonColor: '#3085d6',
        });
        return throwError(() => error);
      })
    );
  }

  // Show a form to create a new task (date picker removed)
  async showCreateTaskForm(): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Create New Task',
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Task Title" required>
        <textarea id="swal-input-description" class="swal2-textarea" placeholder="Task Description"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input-description') as HTMLTextAreaElement).value;

        if (!title) {
          Swal.showValidationMessage('Title is required');
          return false;
        }

        return { title, description };
      }
    });

    if (formValues) {
      const task: Task = {
        title: formValues.title,
        description: formValues.description,
        completed: false
      };

      this.taskService.createTask(task).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Task created successfully!',
            confirmButtonColor: '#3085d6',
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create task. Please try again.',
            confirmButtonColor: '#3085d6',
          });
        }
      });
    }
  }

  // Show a form to update an existing task
  async showUpdateTaskForm(task: Task): Promise<void> {
    const { value: formValues } = await Swal.fire({
      title: 'Update Task',
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Task Title" value="${task.title}" required>
        <textarea id="swal-input-description" class="swal2-textarea" placeholder="Task Description">${task.description || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const title = (document.getElementById('swal-input-title') as HTMLInputElement).value;
        const description = (document.getElementById('swal-input-description') as HTMLTextAreaElement).value;
        if (!title) {
          Swal.showValidationMessage('Title is required');
          return false;
        }
        return { title, description };
      }
    });

    if (formValues) {
      const updatedTask: Task = {
        ...task,
        title: formValues.title,
        description: formValues.description
      };

      this.taskService.updateTask(task.id!, updatedTask).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Task updated successfully!',
            confirmButtonColor: '#3085d6',
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update task. Please try again.',
            confirmButtonColor: '#3085d6',
          });
        }
      });
    }
  }

  // Show confirmation dialog for deleting a task
 async confirmDeleteTask(id: number): Promise<boolean> {
  const result: SweetAlertResult = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      const response = await lastValueFrom(this.taskService.deleteTask(id));
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: response || 'Task has been deleted.', // Fallback for empty response (204)
        confirmButtonColor: '#3085d6',
      });
      return true; // Deletion successful
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete task. Please try again.',
        confirmButtonColor: '#3085d6',
      });
      console.error('Error deleting task:', error);
      return false; // Deletion failed
    }
  }
  return false; // Deletion canceled
}
}