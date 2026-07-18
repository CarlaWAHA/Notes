import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EditableTextComponent } from '../editableTextComponent/editableTextComponent';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, EditableTextComponent],
  template: `
    <div class="min-h-screen bg-[linear-gradient(120deg,#fff7f7_0%,#ffffff_45%,#fee2e2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="flex gap-5 text-sm font-semibold">
            <a href="/home" class="hover:text-red-600">Accueil</a>
            <a href="/programs" class="hover:text-red-600">UE & parcours</a>
            <a href="/admissions" class="hover:text-red-600">Admissions</a>
            <a *ngIf="isAdmin" href="/admin-space" class="hover:text-red-600">Admin</a>
            <a href="/contact" class="hover:text-red-600">Contact</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">A propos de l'etablissement</p>
          <h1 class="mt-3 text-4xl font-black text-black md:text-5xl">La vision philanthropique de Trust Campus</h1>
          <div class="mt-5">
            <app-editable-text
              [isAdmin]="isAdmin"
              [large]="true"
              contentKey="tc.about.vision"
              defaultValue="Trust Campus agit pour les etudiants ayant une ou plusieurs UE non validees dans leur ancien etablissement. Notre mission est de leur offrir une voie de continuation en cours du soir ou en distanciel, sans perdre les acquis deja obtenus."
            ></app-editable-text>
          </div>
        </section>

        <section class="grid gap-5 md:grid-cols-2">
          <article class="rounded-2xl border border-red-100 bg-white p-6">
            <h2 class="text-xl font-bold text-black">Transfert des credits ECTS</h2>
            <p class="mt-3 text-neutral-700">
              Les credits ECTS valides dans l'ancienne ecole sont repris sur les UE equivalentes deja acquises.
              L'etudiant se concentre uniquement sur les UE manquantes.
            </p>
          </article>

          <article class="rounded-2xl border border-red-100 bg-white p-6">
            <h2 class="text-xl font-bold text-black">Objectif: obtention du diplome</h2>
            <p class="mt-3 text-neutral-700">
              En completant les UE restantes chez Trust Campus, l'etudiant peut obtenir, via la VES,
              la reconnaissance academique attendue sans recommencer tout son parcours.
            </p>
          </article>
        </section>

        <section class="rounded-2xl border border-black/10 bg-black p-8 text-white">
          <h2 class="text-2xl font-bold">Pourquoi ce modele fonctionne</h2>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <div class="rounded-xl bg-white/10 p-4">
              <p class="font-semibold">Parcours individualise</p>
              <p class="mt-2 text-sm text-red-100">Chaque etudiant suit un plan cible sur ses UE manquantes.</p>
            </div>
            <div class="rounded-xl bg-white/10 p-4">
              <p class="font-semibold">Compatibilite professionnelle</p>
              <p class="mt-2 text-sm text-red-100">Cours du soir et distanciel pour etudiants en activite.</p>
            </div>
            <div class="rounded-xl bg-white/10 p-4">
              <p class="font-semibold">Inclusion reelle</p>
              <p class="mt-2 text-sm text-red-100">Aucun talent ne doit etre bloque par une interruption de parcours.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AboutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  isAdmin = false;

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
  }
}
