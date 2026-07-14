import { Routes } from '@angular/router';
import { HomeComponent } from './homeComponent/homeComponent';
import { AdminDashboardComponent } from './adminDashboard/adminDashboard';
import { StudentDashboardComponent } from './studentDashboard/studentDashboard';
import { noteListComponent } from './noteListComponent/noteListComponent';
import { NoteDetailComponent } from './note-detail-component/note-detail-component';
import { authGuard } from './guards/authGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notes',
    component: noteListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notes/:id',
    component: NoteDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
