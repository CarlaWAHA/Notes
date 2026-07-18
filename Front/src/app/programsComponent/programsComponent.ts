import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { noteService } from '../Services/note.service';
import { NoteModel } from '../models/note';
import { EditableTextComponent } from '../editableTextComponent/editableTextComponent';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [CommonModule, EditableTextComponent],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top,#fee2e2_0,#ffffff_40%,#fff7f7_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="flex gap-5 text-sm font-semibold">
            <a href="/home" class="hover:text-red-600">Accueil</a>
            <a href="/about" class="hover:text-red-600">A propos</a>
            <a href="/admissions" class="hover:text-red-600">Admissions</a>
            <a *ngIf="isAdmin" href="/admin-space" class="hover:text-red-600">Admin</a>
            <a href="/contact" class="hover:text-red-600">Contact</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Offre academique</p>
          <h1 class="mt-3 text-4xl font-black text-black md:text-5xl">UE, parcours et reinscriptions</h1>
          <div class="mt-4">
            <app-editable-text
              [isAdmin]="isAdmin"
              contentKey="tc.programs.intro"
              defaultValue="Cette page presente les types d'UE que l'etudiant peut reprendre, en conservant sa logique actuelle d'inscription et de consultation selon les droits admin/etudiant existants dans la plateforme."
            ></app-editable-text>
          </div>
        </section>

        <section class="rounded-2xl border border-red-100 bg-white p-6">
          <h2 class="text-2xl font-bold text-black">Cours disponibles</h2>
          <p class="mt-2 text-sm text-neutral-700">Cette liste est alimentee par les cours geres par l'administrateur.</p>

          <div *ngIf="loading" class="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">Chargement des cours...</div>
          <div *ngIf="errorMessage" class="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{{ errorMessage }}</div>

          <div class="mt-5 overflow-x-auto" *ngIf="courses.length > 0">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-red-100 text-left text-sm uppercase tracking-wide text-red-700">
                  <th class="px-4 py-3">Titre du cours</th>
                  <th class="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let course of courses" class="border-b border-red-50 align-top">
                  <td class="px-4 py-3 font-semibold text-black">{{ course.title }}</td>
                  <td class="px-4 py-3 text-sm text-neutral-700">{{ course.content }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p *ngIf="!loading && !errorMessage && courses.length === 0" class="mt-4 text-sm text-neutral-600">
            Aucun cours n'a encore ete publie par l'administrateur.
          </p>
        </section>

        <section class="rounded-2xl border border-black/10 bg-black p-8 text-white">
          <h2 class="text-2xl font-bold">Acces et roles</h2>
          <ul class="mt-4 space-y-2 text-sm text-red-100">
            <li>Admin: creation et gestion des etudiants, attribution des UE et saisie des notes.</li>
            <li>Etudiant: acces en lecture de son parcours, de ses UE et de ses resultats.</li>
            <li>Inscription: conservee selon le flux deja present dans le backend et l'interface actuelle.</li>
          </ul>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class ProgramsComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly notesService = inject(noteService);

  isAdmin = false;
  courses: NoteModel[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.isAdmin = roles.includes('ROLE_ADMIN');
    } catch {
      this.isAdmin = false;
    }

    this.loadCourses();
  }

  private loadCourses(): void {
    this.loading = true;
    this.errorMessage = '';

    this.notesService.getAllNotes().subscribe({
      next: (notes) => {
        this.courses = notes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Connectez-vous pour consulter les cours disponibles.';
      }
    });
  }
}
