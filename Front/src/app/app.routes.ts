import { Routes } from '@angular/router';
import { HomeComponent } from './homeComponent/homeComponent';
import { AdminDashboardComponent } from './adminDashboard/adminDashboard';
import { StudentDashboardComponent } from './studentDashboard/studentDashboard';
import { noteListComponent } from './noteListComponent/noteListComponent';
import { NoteDetailComponent } from './note-detail-component/note-detail-component';
import { authGuard } from './guards/authGuard';
import { AboutComponent } from './aboutComponent/aboutComponent';
import { ProgramsComponent } from './programsComponent/programsComponent';
import { ContactComponent } from './contactComponent/contactComponent';
import { AdmissionsComponent } from './admissionsComponent/admissionsComponent';
import { AdminSpaceComponent } from './adminSpaceComponent/adminSpaceComponent';
import { adminGuard } from './guards/adminGuard';

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
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'programs',
    component: ProgramsComponent
  },
  {
    path: 'admissions',
    component: AdmissionsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'admin-space',
    component: AdminSpaceComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'student',
    component: StudentDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'notes',
    component: noteListComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'notes/:id',
    component: NoteDetailComponent,
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
