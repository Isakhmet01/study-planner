import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Tasks } from './components/tasks/tasks';
import { Subjects } from './components/subjects/subjects';
import { Signup } from './components/signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'tasks', component: Tasks },
  { path: 'subjects', component: Subjects },
  { path: 'signup', component: Signup },
];
