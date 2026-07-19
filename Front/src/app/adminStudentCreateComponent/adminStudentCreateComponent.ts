import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentService } from '../Services/studentService';
import { UEService } from '../Services/ueService';
import { UE } from '../models/ue';

@Component({
  selector: 'app-admin-student-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top,#fee2e2_0,#ffffff_45%,#fff7f7_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <h1 class="text-2xl font-black text-black">Creation <span class="text-red-600">Etudiant</span></h1>
          <a href="/admin" class="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold hover:bg-red-50">Retour Dashboard</a>
        </div>
      </header>

      <main class="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
        <section class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-black text-black">Nouvel etudiant</h2>
          <p class="mt-2 text-sm text-neutral-700">Cette page est reservee a l'admin. Créez un compte et affectez au moins une UE existante.</p>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold">Nom d'utilisateur</label>
              <input [(ngModel)]="username" type="text" placeholder="etudiant@trust.com" class="w-full rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-semibold">Mot de passe</label>
              <input [(ngModel)]="password" type="password" placeholder="Minimum 8 caracteres" class="w-full rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" />
            </div>
          </div>

          <div class="mt-5">
            <p class="mb-2 text-sm font-semibold">Affecter les UE existantes</p>
            <div class="grid gap-2 md:grid-cols-2">
              <label *ngFor="let ue of availableUEs" class="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50/30 px-3 py-2 text-sm">
                <input type="checkbox" [checked]="isSelected(ue.code)" (change)="toggleUE(ue.code, $any($event.target).checked)" />
                <span>{{ ue.code }} - {{ ue.titre }}</span>
              </label>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-2">
            <button (click)="createStudent()" [disabled]="isSaving" class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-black disabled:opacity-50">
              <span *ngIf="!isSaving">Creer l'etudiant</span>
              <span *ngIf="isSaving">Creation...</span>
            </button>
            <button (click)="resetForm()" class="rounded-lg border border-black px-4 py-2 font-semibold hover:border-red-600 hover:text-red-600">Reinitialiser</button>
          </div>

          <div *ngIf="message" class="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{{ message }}</div>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AdminStudentCreateComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly studentService = inject(StudentService);
  private readonly ueService = inject(UEService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  selectedUeCodes: string[] = [];
  availableUEs: UE[] = [];
  isSaving = false;
  message = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ueService.getAllUEs().subscribe({
      next: (ues) => {
        this.availableUEs = ues;
      },
      error: () => {
        this.message = 'Impossible de charger les UE.';
      }
    });
  }

  isSelected(code: string): boolean {
    return this.selectedUeCodes.includes(code);
  }

  toggleUE(code: string, checked: boolean): void {
    if (checked && !this.selectedUeCodes.includes(code)) {
      this.selectedUeCodes.push(code);
      return;
    }

    if (!checked) {
      this.selectedUeCodes = this.selectedUeCodes.filter((item) => item !== code);
    }
  }

  createStudent(): void {
    if (!this.username.trim() || !this.password.trim() || this.selectedUeCodes.length === 0) {
      this.message = 'Username, mot de passe et au moins une UE sont obligatoires.';
      return;
    }

    this.isSaving = true;
    this.message = '';

    this.studentService.createStudent({
      username: this.username.trim(),
      password: this.password,
      ueCodes: this.selectedUeCodes
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/admin']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSaving = false;
        if (err.status === 401 || err.status === 403) {
          this.message = 'Session admin invalide ou expiree. Deconnectez-vous puis reconnectez-vous avec admin@trust.com.';
          return;
        }

        if (err.status === 400) {
          if (typeof err.error === 'string' && err.error.trim().length > 0) {
            this.message = err.error;
            return;
          }

          this.message = 'Donnees invalides: username unique, mot de passe non vide et au moins une UE.';
          return;
        }

        this.message = 'Impossible de creer cet etudiant.';
      }
    });
  }

  resetForm(): void {
    this.username = '';
    this.password = '';
    this.selectedUeCodes = [];
    this.message = '';
  }
}
