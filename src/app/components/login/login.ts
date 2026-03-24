import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.js'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        if (res?.status === true) {
          if (res?.user?.name) {
            localStorage.setItem('user_name', res.user.name);
          }
          if (res?.user?.id) {
            localStorage.setItem('user_id', String(res.user.id));
          }
          if (res?.token) {
            this.authService.saveToken(res.token);
          }
          this.router.navigate(['/home']);
        } else {
          alert('Error en el login');
        }
      },
      error: (err: any) => {
        alert('Correo o contraseña incorrectos');
        console.error(err);
      }
    });
  }
}