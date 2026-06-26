import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'notes',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'notes/:id',
    renderMode: RenderMode.Server
  }
];
