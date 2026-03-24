import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.js'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  user = { 
    name: '', 
    email: '', 
    password: '' 
  };

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.authService.register(this.user).subscribe({
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

          alert('¡Registro exitoso! Bienvenido a Q-LESS.');
          this.router.navigate(['/home']);
        } else {
          alert('Error en el registro: ' + res?.message);
        }
      },
      error: (err: any) => {
        if (err?.status === 422) {
          alert('El correo electrónico ya está registrado o los datos son inválidos.');
        } else {
          alert('Hubo un error en el servidor. Inténtalo más tarde.');
        }
        console.error('Error en el registro:', err);
      }
    });
  }
}