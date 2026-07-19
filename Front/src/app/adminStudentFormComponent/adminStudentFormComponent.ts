import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../Services/studentService';
import { UEService } from '../Services/ueService';
import { UE } from '../models/ue';

@Component({
  selector: 'app-admin-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fecaca_0%,#ffffff_45%,#fef2f2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a routerLink="/home" class="text-xl font-black tracking-wide text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="hidden gap-6 text-sm font-semibold md:flex">
            <a routerLink="/admin-space" class="transition hover:text-red-600">Admin</a>
            <a routerLink="/admin" class="transition text-red-700">Etudiants</a>
            <a routerLink="/admin/ues" class="transition hover:text-red-600">UE</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-4xl px-4 py-10 md:px-8">
        <section class="rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Administration</p>
          <h1 class="mt-3 text-3xl font-black text-black md:text-4xl">{{ isEditMode ? 'Modifier un etudiant' : 'Ajouter un etudiant' }}</h1>
          <p class="mt-3 text-neutral-700">Creer ou mettre a jour un etudiant puis l'affecter a une ou plusieurs UE existantes.</p>

          <form class="mt-8 space-y-6" (ngSubmit)="submit()">
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold text-neutral-800">Nom d'utilisateur</label>
                <input
                  [(ngModel)]="model.username"
                  name="username"
                  required
                  class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="etudiant@trust.com"
                />
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-neutral-800">Mot de passe {{ isEditMode ? '(laisser vide pour conserver)' : '' }}</label>
                <input
                  [(ngModel)]="model.password"
                  name="password"
                  [required]="!isEditMode"
                  type="password"
                  class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="12345678"
                />
              </div>
            </div>

            <div>
              <label class="mb-3 block text-sm font-semibold text-neutral-800">UE existantes</label>
              <div class="grid gap-3 md:grid-cols-2">
                <label *ngFor="let ue of ues" class="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4">
                  <input
                    type="checkbox"
                    [checked]="isSelected(ue.code)"
                    (change)="toggleUE(ue.code, $any($event.target).checked)"
                    class="mt-1 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                  />
                  <span>
                    <span class="block font-semibold text-black">{{ ue.code }}</span>
                    <span class="text-sm text-neutral-600">{{ ue.titre }}</span>
                  </span>
                </label>
              </div>
            </div>

            <div *ngIf="errorMessage" class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {{ errorMessage }}
            </div>

            <div class="flex flex-wrap gap-3">
              <button
                type="submit"
                [disabled]="isLoading"
                class="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-50"
              >
                {{ isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre a jour' : 'Creer l\'etudiant') }}
              </button>
              <a routerLink="/admin" class="rounded-full border border-black px-6 py-3 font-semibold text-black transition hover:border-red-600 hover:text-red-600">Retour</a>
            </div>
          </form>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class AdminStudentFormComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly studentService = inject(StudentService);
  private readonly ueService = inject(UEService);

  isEditMode = false;
  studentId: number | null = null;
  isLoading = false;
  errorMessage = '';
  ues: UE[] = [];
  selectedUeCodes: string[] = [];

  model = {
    username: '',
    password: ''
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadUEs();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.studentId = Number(idParam);
      this.loadStudent(this.studentId);
    }
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

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.model.username = student.user?.username || '';
        this.selectedUeCodes = (student.ues || []).map((ue) => ue.code);
      },
      error: () => {
        this.errorMessage = 'Impossible de charger cet etudiant.';
      }
    });
  }

  isSelected(code: string): boolean {
    return this.selectedUeCodes.includes(code);
  }

  toggleUE(code: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedUeCodes.includes(code)) {
        this.selectedUeCodes = [...this.selectedUeCodes, code];
      }
      return;
    }

    this.selectedUeCodes = this.selectedUeCodes.filter((ueCode) => ueCode !== code);
  }

  submit(): void {
    if (!this.model.username.trim() || this.selectedUeCodes.length === 0 || (!this.isEditMode && !this.model.password.trim())) {
      this.errorMessage = 'Le nom d\'utilisateur, le mot de passe initial et au moins une UE sont obligatoires.';
      return;
    }

    const payload = {
      username: this.model.username.trim(),
      password: this.model.password,
      ueCodes: this.selectedUeCodes
    };

    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.isEditMode && this.studentId !== null
      ? this.studentService.updateStudent(this.studentId, payload)
      : this.studentService.createStudent(payload);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error || 'Impossible d\'enregistrer l\'etudiant.';
      }
    });
  }
}
