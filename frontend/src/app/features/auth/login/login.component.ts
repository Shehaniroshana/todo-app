import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
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

  // Example properties for login
 username: string = '';
  password: string = '';

  onSubmit() {
    if (this.username && this.password) {
      console.log('Login attempted with:', { username: this.username, password: this.password });
      Swal.fire({
        title: 'Login Successful',
        text: `Welcome back, ${this.username}!`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Login Failed',
        text: 'Please enter both username and password.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  }
}
