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
  errors: { type: string; message: string }[] = [];
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  clearErrors(): void {
    this.errors = [];
  }

  addError(type: string, message: string): void {
    this.errors.push({ type, message });
  }

  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    if (!this.user.name.trim()) {
      this.addError('danger', 'El nombre es requerido');
      isValid = false;
    }

    if (!this.user.email.trim()) {
      this.addError('danger', 'El email es requerido');
      isValid = false;
    } else if (!this.isValidEmail(this.user.email)) {
      this.addError('warning', 'Formato de email inválido');
      isValid = false;
    }

    if (!this.user.password.trim() || this.user.password.length < 8) {
      this.addError('danger', 'La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  registrar(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.clearErrors();

    this.authService.register(this.user).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === true) {
          if (res.user?.name) localStorage.setItem('user_name', res.user.name);
          if (res.user?.id) localStorage.setItem('user_id', String(res.user.id));
          
          this.authService.saveToken(res.token);
          this.addError('success', '¡Registro exitoso! Redirigiendo...');
          
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err?.status === 422) {
          const serverErrors = err.error.errors;
          if (serverErrors?.email) {
            this.addError('danger', 'Este email ya está registrado.');
          } else {
            this.addError('danger', 'Error de validación en los datos.');
          }
        } else {
          this.addError('danger', 'Error de conexión con el servidor.');
        }
      }
    });
  }
}