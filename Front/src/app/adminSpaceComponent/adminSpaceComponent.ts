import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-space',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fecaca_0%,#ffffff_45%,#fef2f2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black tracking-wide text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="hidden gap-6 text-sm font-semibold md:flex">
            <a href="/about" class="transition hover:text-red-600">A propos</a>
            <a href="/programs" class="transition hover:text-red-600">UE & parcours</a>
            <a href="/admissions" class="transition hover:text-red-600">Admissions</a>
            <a href="/admin-space" class="transition text-red-700">Admin</a>
            <a href="/contact" class="rounded-full bg-red-600 px-4 py-2 text-white transition hover:bg-black">Contact</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Administration</p>
          <h1 class="mt-3 text-4xl font-black text-black md:text-5xl">Choisir un module de gestion</h1>
          <p class="mt-4 text-neutral-700">
            Cet espace est reserve aux administrateurs authentifies. Selectionnez le module CRUD a utiliser.
          </p>
        </section>

        <section class="grid gap-6 md:grid-cols-2">
          <a href="/admin" class="group rounded-2xl border border-red-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 class="text-2xl font-bold text-black">CRUD Etudiants</h2>
            <p class="mt-3 text-neutral-700">Creer des comptes etudiants, consulter la liste et gerer leurs UE et notes.</p>
            <p class="mt-4 text-sm font-semibold text-red-700 group-hover:text-black">Ouvrir le module</p>
          </a>

          <a href="/notes" class="group rounded-2xl border border-red-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h2 class="text-2xl font-bold text-black">CRUD Cours</h2>
            <p class="mt-3 text-neutral-700">Ajouter, modifier, consulter et supprimer les cours publies pour les etudiants.</p>
            <p class="mt-4 text-sm font-semibold text-red-700 group-hover:text-black">Ouvrir le module</p>
          </a>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AdminSpaceComponent {}
