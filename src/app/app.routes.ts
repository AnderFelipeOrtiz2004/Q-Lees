import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.js';
import { CreateProduct } from './components/create-product/create-product.js';
import { EditProduct } from './components/edit-product/edit-product.js';
import { LoginComponent } from './components/login/login.js';
import { RegisterComponent } from './components/register/register.js';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nuevo-producto', component: CreateProduct },
  { path: 'editar-producto/:id', component: EditProduct },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];