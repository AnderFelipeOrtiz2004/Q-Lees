import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.js';
import { CreateProduct } from './components/create-product/create-product.js';
import { EditProduct } from './components/edit-product/edit-product.js';
import { LoginComponent } from './components/login/login.js';
import { RegisterComponent } from './components/register/register.js';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'nuevo-producto', component: CreateProduct, canActivate: [AuthGuard] },
  { path: 'editar-producto/:id', component: EditProduct, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];