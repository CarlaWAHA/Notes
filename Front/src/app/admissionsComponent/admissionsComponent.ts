import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EditableTextComponent } from '../editableTextComponent/editableTextComponent';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, EditableTextComponent],
  template: `
    <div class="min-h-screen bg-[linear-gradient(140deg,#ffffff_0%,#fff1f2_50%,#ffe4e6_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="flex gap-5 text-sm font-semibold">
            <a href="/home" class="hover:text-red-600">Accueil</a>
            <a href="/about" class="hover:text-red-600">A propos</a>
            <a href="/programs" class="hover:text-red-600">UE & parcours</a>
            <a *ngIf="isAdmin" href="/admin-space" class="hover:text-red-600">Admin</a>
            <a href="/contact" class="hover:text-red-600">Contact</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Admissions</p>
          <h1 class="mt-3 text-4xl font-black text-black md:text-5xl">Procedure de reinscription et VES</h1>
          <div class="mt-4">
            <app-editable-text
              [isAdmin]="isAdmin"
              contentKey="tc.admissions.intro"
              defaultValue="Un etudiant ayant une ou plusieurs UE en moins peut se reinscrire chez Trust Campus, en cours du soir ou en distanciel, pour finaliser son parcours."
            ></app-editable-text>
          </div>
        </section>

        <section class="grid gap-5 md:grid-cols-4">
          <article class="rounded-2xl border border-red-100 bg-white p-5">
            <p class="text-xs font-bold uppercase tracking-wide text-red-700">Etape 1</p>
            <h2 class="mt-2 text-lg font-bold">Dossier academique</h2>
            <p class="mt-2 text-sm text-neutral-700">Analyse du releve de notes et des UE validees.</p>
          </article>
          <article class="rounded-2xl border border-red-100 bg-white p-5">
            <p class="text-xs font-bold uppercase tracking-wide text-red-700">Etape 2</p>
            <h2 class="mt-2 text-lg font-bold">Equivalence ECTS</h2>
            <p class="mt-2 text-sm text-neutral-700">Transfert des credits deja acquis sur les UE equivalentes.</p>
          </article>
          <article class="rounded-2xl border border-red-100 bg-white p-5">
            <p class="text-xs font-bold uppercase tracking-wide text-red-700">Etape 3</p>
            <h2 class="mt-2 text-lg font-bold">Plan pedagogique</h2>
            <p class="mt-2 text-sm text-neutral-700">Selection des UE restantes selon disponibilite et modalite.</p>
          </article>
          <article class="rounded-2xl border border-red-100 bg-white p-5">
            <p class="text-xs font-bold uppercase tracking-wide text-red-700">Etape 4</p>
            <h2 class="mt-2 text-lg font-bold">Validation VES</h2>
            <p class="mt-2 text-sm text-neutral-700">Obtention du diplome apres completion des UE manquantes.</p>
          </article>
        </section>

        <section class="rounded-2xl border border-black/10 bg-black p-8 text-white">
          <h2 class="text-2xl font-bold">Pieces recommandees</h2>
          <ul class="mt-4 space-y-2 text-sm text-red-100">
            <li>Releve de notes detaille et historique des UE suivies.</li>
            <li>Attestation de credits ECTS acquis dans l'ancien etablissement.</li>
            <li>Projet personnel: rythme souhaité, soir ou distanciel.</li>
          </ul>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AdmissionsComponent implements OnInit {
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
