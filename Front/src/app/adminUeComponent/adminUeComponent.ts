import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UEService } from '../Services/ueService';
import { UE } from '../models/ue';

@Component({
  selector: 'app-admin-ue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fecaca_0%,#ffffff_45%,#fef2f2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a routerLink="/home" class="text-xl font-black tracking-wide text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="hidden gap-6 text-sm font-semibold md:flex">
            <a routerLink="/admin-space" class="transition hover:text-red-600">Admin</a>
            <a routerLink="/admin" class="transition hover:text-red-600">Etudiants</a>
            <a routerLink="/admin/ues" class="transition text-red-700">UE</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-10 md:px-8 space-y-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Administration</p>
          <h1 class="mt-3 text-3xl font-black text-black md:text-4xl">Gestion des UE</h1>
          <p class="mt-3 text-neutral-700">Ajoutez, modifiez et supprimez les UE disponibles pour l'inscription des etudiants.</p>
        </section>

        <section class="rounded-3xl border border-red-200 bg-white p-6 shadow-lg shadow-red-100">
          <h2 class="text-xl font-bold text-black">{{ editingId ? 'Modifier une UE' : 'Ajouter une UE' }}</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-[1fr_2fr_auto]">
            <input [(ngModel)]="form.code" placeholder="Code UE" class="rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200" />
            <input [(ngModel)]="form.titre" placeholder="Intitule" class="rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200" />
            <button (click)="submit()" [disabled]="loading" class="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-50">{{ editingId ? 'Mettre a jour' : 'Ajouter' }}</button>
          </div>
          <div class="mt-3" *ngIf="editingId">
            <button (click)="cancelEdit()" class="rounded-full border border-black px-5 py-2 text-sm font-semibold text-black transition hover:border-red-600 hover:text-red-600">Annuler</button>
          </div>
          <div *ngIf="errorMessage" class="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">{{ errorMessage }}</div>
        </section>

        <section class="rounded-3xl border border-red-200 bg-white p-6 shadow-lg shadow-red-100">
          <h2 class="text-xl font-bold text-black">Liste des UE</h2>
          <div class="mt-6 overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-red-100 text-left text-sm uppercase tracking-wide text-red-700">
                  <th class="px-4 py-3">Code</th>
                  <th class="px-4 py-3">Intitule</th>
                  <th class="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ue of ues" class="border-b border-red-50 align-top">
                  <td class="px-4 py-3 font-semibold text-black">{{ ue.code }}</td>
                  <td class="px-4 py-3 text-neutral-700">{{ ue.titre }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-2">
                      <button (click)="startEdit(ue)" class="rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200">Modifier</button>
                      <button (click)="deleteUE(ue)" class="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200">Supprimer</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AdminUeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly ueService = inject(UEService);

  ues: UE[] = [];
  errorMessage = '';
  loading = false;
  editingId: number | null = null;
  form: UE = { code: '', titre: '' };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const roles = localStorage.getItem('roles') || '';
    if (!roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadUEs();
  }

  loadUEs(): void {
    this.ueService.getAllUEs().subscribe({
      next: (data) => {
        this.ues = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les UE.';
      }
    });
  }

  submit(): void {
    if (!this.form.code.trim() || !this.form.titre.trim()) {
      this.errorMessage = 'Le code et l\'intitule sont obligatoires.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      code: this.form.code.trim(),
      titre: this.form.titre.trim()
    };

    const request$ = this.editingId
      ? this.ueService.updateUE(this.editingId, payload)
      : this.ueService.createUE(payload);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.cancelEdit();
        this.loadUEs();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error || 'Impossible d\'enregistrer cette UE.';
      }
    });
  }

  startEdit(ue: UE): void {
    this.editingId = ue.id || null;
    this.form = { code: ue.code, titre: ue.titre };
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = { code: '', titre: '' };
  }

  deleteUE(ue: UE): void {
    if (!ue.id) {
      return;
    }

    this.errorMessage = '';
    this.ueService.deleteUE(ue.id).subscribe({
      next: () => {
        this.loadUEs();
      },
      error: (error) => {
        this.errorMessage = error.error || 'Impossible de supprimer cette UE.';
      }
    });
  }
}
