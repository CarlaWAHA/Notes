import { Routes } from '@angular/router';
import { noteListComponent } from './noteListComponent/noteListComponent';
import { NoteDetailComponent } from './note-detail-component/note-detail-component';
import { LoginComponent } from './loginComponent/loginComponent';
import { authGuard } from './guards/authGuard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
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
    redirectTo: 'notes'
  }
];
