import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent { 
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        alert('¡Bienvenido a Q-LESS!');
        this.router.navigate(['/productos']);
      },
      error: (err) => {
        alert('Correo o contraseña incorrectos');
        console.error(err);
      }
    });
  }
}