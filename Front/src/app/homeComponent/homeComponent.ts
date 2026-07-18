import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoginComponent } from '../loginComponent/loginComponent';
import { EditableTextComponent } from '../editableTextComponent/editableTextComponent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, EditableTextComponent],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fecaca_0%,#ffffff_45%,#fef2f2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black tracking-wide text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="hidden gap-6 text-sm font-semibold md:flex">
            <a href="/about" class="transition hover:text-red-600">A propos</a>
            <a href="/programs" class="transition hover:text-red-600">UE & parcours</a>
            <a href="/admissions" class="transition hover:text-red-600">Admissions</a>
            <a *ngIf="isAdmin" href="/admin-space" class="transition hover:text-red-600">Admin</a>
            <a href="/contact" class="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-black">Contact</a>
          </nav>
        </div>
      </header>

      <section class="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-8 pt-10 md:grid-cols-2 md:px-8">
        <div class="space-y-6">
          <span class="inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-700">
            Formation du soir et distanciel
          </span>
          <h1 class="text-4xl font-black leading-tight text-black md:text-5xl">
            Reprendre ses UE, transferer ses ECTS, obtenir son diplome avec un parcours flexible.
          </h1>
          <app-editable-text
            [isAdmin]="isAdmin"
            [large]="true"
            contentKey="tc.home.hero"
            defaultValue="Trust Campus accompagne les etudiants qui n'ont pas valide toutes leurs UE dans leur ancien etablissement. Notre approche permet la reinscription sur les UE manquantes en cours du soir ou en distanciel, avec reconnaissance des credits ECTS deja acquis."
          ></app-editable-text>
          <div class="flex flex-wrap gap-3">
            <a href="/programs" class="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-black">Voir les UE</a>
            <a href="/about" class="rounded-full border border-black px-6 py-3 font-semibold text-black transition hover:border-red-600 hover:text-red-600">Notre vision</a>
          </div>
        </div>

        <div class="relative overflow-hidden rounded-3xl border border-red-200 bg-white p-6 shadow-2xl shadow-red-100">
          <div class="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-100"></div>
          <div class="absolute -bottom-12 -left-12 h-28 w-28 rounded-full bg-black/5"></div>

          <div class="relative z-10 mb-4 border-b border-red-100 pb-4">
            <h2 class="text-center text-sm font-bold uppercase tracking-[0.2em] text-red-700">Se connecter</h2>
          </div>

          <div class="relative z-10">
            <app-login-component></app-login-component>
          </div>
        </div>
      </section>

      <section class="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-12 md:grid-cols-3 md:px-8">
        <article class="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-bold text-black">Admin uniquement</h2>
          <p class="mt-2 text-sm text-neutral-700">Le CRUD des etudiants, UE et notes reste reserve aux utilisateurs administrateurs.</p>
        </article>
        <article class="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-bold text-black">Etudiant en lecture</h2>
          <p class="mt-2 text-sm text-neutral-700">Chaque etudiant consulte ses UE, ses inscriptions et ses resultats depuis son espace personnel.</p>
        </article>
        <article class="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
          <h2 class="text-lg font-bold text-black">Parcours adaptatif</h2>
          <p class="mt-2 text-sm text-neutral-700">Les credits ECTS valides sont conserves pour accelerer l'obtention du diplome via la VES.</p>
        </article>
      </section>

      <footer class="border-t border-red-100 bg-white py-5 text-center text-xs text-neutral-600">
        © 2026 Trust Campus. Theme clair, moderne et centre sur la reussite etudiante.
      </footer>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  isAdmin = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rolesRaw = localStorage.getItem('roles') || '[]';
    let roles: string[] = [];
    try {
      roles = JSON.parse(rolesRaw);
    } catch {
      roles = [];
    }

    this.isAdmin = roles.includes('ROLE_ADMIN');
  }
}
