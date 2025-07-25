import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword: boolean = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  credentials: User = { username: '', password: '' };


  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please enter both username and password',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error.error || 'Invalid username or password',
          confirmButtonText: 'OK'
        });
      }
    });
  }
}
