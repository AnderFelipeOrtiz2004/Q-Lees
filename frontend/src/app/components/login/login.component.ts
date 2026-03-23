import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthResponse, LoginRequest } from '../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.authService.login(request).subscribe({
      next: (res: AuthResponse) => {
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = 'El usuario no se ha creado o no existe.';
        } else if (err.status === 401) {
          this.errorMessage = 'Contraseña incorrecta.';
        } else {
          this.errorMessage = 'Error de conexión. Intenta más tarde.';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}