import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CalendarComponentComponent } from '../../components/calendar-component/calendar-component.component';
import { SweetAlertFormService } from '../../core/services/SweetAlertFormService';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponentComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  filterStatus: 'all' | 'pending' | 'completed' = 'all';
  time: string = '';
  date: string = '';
  private intervalId: any;

  constructor(
    private alertForms: SweetAlertFormService,
    private authService: AuthService,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAllTask();
    this.updateDateTime();
    this.intervalId = setInterval(() => this.updateDateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateDateTime() {
    const currentTime = new Date();
    this.date = currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    this.time=currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    this.cdr.detectChanges();
  }

  async getAllTask() {
    await this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilters();
        console.log('Tasks:', this.tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  applyFilters() {
    let filtered = [...this.tasks];

    if (this.filterStatus === 'pending') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (this.filterStatus === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredTasks = filtered;
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  setFilter(status: 'all' | 'pending' | 'completed') {
    this.filterStatus = status;
    this.applyFilters();
  }

  async addTask() {
    await this.alertForms.showCreateTaskForm().then(() => {
setTimeout(() => {
      this.getAllTask();
    }, 1000);    });
  }

  toggleCompleted(task: Task) {
    if (task.id == null) return;
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        task.completed = updatedTask.completed;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
  }

  async editTask(task: Task) {
    await this.alertForms.showUpdateTaskForm(task);
setTimeout(() => {
      this.getAllTask();
    }, 1000);  }

  async deleteTask(id: number) {
    if (id == null) return;
    await this.alertForms.confirmDeleteTask(id);
    setTimeout(() => {
      this.getAllTask();
    }, 1000);
  }

  trackByTaskId(index: number, task: Task): number | undefined {
    return task.id;
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        window.location.reload();
      }
    });
  } 

}