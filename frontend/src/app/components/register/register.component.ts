import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password_confirmation = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.errorMessage = '';

    const request = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.authService.register(request).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.errorMessage = 'Error al registrar. Intenta de nuevo.';
      }
    });
  }
}