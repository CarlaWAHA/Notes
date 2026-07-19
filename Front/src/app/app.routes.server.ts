import { RenderMode, ServerRoute } from '@angular/ssr';
//Ajustement des routes
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'programs',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admissions',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'contact',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin-space',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/students/new',
    renderMode: RenderMode.Server
  },
  {
    path: 'student',
    renderMode: RenderMode.Server
  },
  {
    path: 'notes',
    renderMode: RenderMode.Server
  },
  {
    path: 'notes/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
