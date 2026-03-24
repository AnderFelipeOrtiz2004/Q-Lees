import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register'; 
import { LoginComponent } from './components/login/login'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' } 
];