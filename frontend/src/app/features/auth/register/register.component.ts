import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
showPassword: boolean = false;
  user: User = { username: '', password: '', email: '' };

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (!this.user.username || !this.user.password || !this.user.email) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Please fill in all fields',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'You can now log in',
          confirmButtonText: 'OK'
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.error.error || 'An error occurred during registration',
          confirmButtonText: 'OK'
        });
      }
    });
  }

}
