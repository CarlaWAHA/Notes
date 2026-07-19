import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../Services/studentService';
import { GradeService } from '../Services/gradeService';
import { Student } from '../models/student';
import { UE } from '../models/ue';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#fecaca_0%,#ffffff_45%,#fef2f2_100%)] text-neutral-900">
      <nav class="border-b border-red-100 bg-white/90 backdrop-blur">
        <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <h1 class="text-2xl font-black text-black">Tableau de Bord <span class="text-red-600">Admin</span></h1>
          <div class="flex items-center gap-3">
            <a routerLink="/home" class="rounded-full border border-red-200 px-4 py-2 font-semibold text-black transition hover:border-red-500 hover:text-red-600">Accueil</a>
            <a routerLink="/admissions" class="rounded-full border border-red-200 px-4 py-2 font-semibold text-black transition hover:border-red-500 hover:text-red-600">Admissions</a>
            <a routerLink="/admin-space" class="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-black">Admin</a>
            <button
              (click)="logout()"
              class="rounded-full bg-black px-6 py-2 font-semibold text-white transition hover:bg-red-600"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <div class="mx-auto max-w-7xl p-6 md:px-8">
        <section class="mb-6 rounded-3xl border border-red-200 bg-white p-8 shadow-lg shadow-red-100">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Administration</p>
          <h2 class="mt-3 text-3xl font-black text-black">Gerer les etudiants, leurs UE et les notes</h2>
        </section>

        <div class="mb-6 flex gap-4 border-b border-red-100">
          <button
            (click)="activeTab = 'manage-students'"
            [class.border-b-4]="activeTab === 'manage-students'"
            [class.border-red-600]="activeTab === 'manage-students'"
            [class.text-red-600]="activeTab === 'manage-students'"
            [class.text-slate-600]="activeTab !== 'manage-students'"
            class="pb-4 font-semibold transition"
          >
            Gérer les Étudiants
          </button>
          <button
            (click)="activeTab = 'assign-grades'"
            [class.border-b-4]="activeTab === 'assign-grades'"
            [class.border-red-600]="activeTab === 'assign-grades'"
            [class.text-red-600]="activeTab === 'assign-grades'"
            [class.text-slate-600]="activeTab !== 'assign-grades'"
            class="pb-4 font-semibold transition"
          >
            Attribuer des Notes
          </button>
        </div>

        <div *ngIf="activeTab === 'manage-students'" class="space-y-6">
          <div class="rounded-3xl border border-red-200 bg-white p-6 shadow-lg shadow-red-100">
            <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 class="text-xl font-bold text-black">Liste des Étudiants</h2>
              <div class="flex flex-wrap gap-3">
                <a routerLink="/admin/students/new" class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-black">Ajouter un etudiant</a>
                <a routerLink="/admin/ues" class="rounded-full border border-black px-5 py-2 font-semibold text-black transition hover:border-red-600 hover:text-red-600">Gerer les UE</a>
              </div>
            </div>

            <div *ngIf="studentMessage" class="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700">{{ studentMessage }}</div>
            <div *ngIf="studentErrorMessage" class="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">{{ studentErrorMessage }}</div>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead class="border-b border-red-100 bg-red-50/60">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-black">ID</th>
                    <th class="px-4 py-3 text-left font-semibold text-black">Nom d'utilisateur</th>
                    <th class="px-4 py-3 text-left font-semibold text-black">UE</th>
                    <th class="px-4 py-3 text-left font-semibold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let student of students" class="border-b border-red-50 hover:bg-red-50/40">
                    <td class="px-4 py-3 text-neutral-700">{{ student.id }}</td>
                    <td class="px-4 py-3 text-neutral-700">{{ student.user?.username }}</td>
                    <td class="px-4 py-3 text-neutral-700">
                      <span *ngFor="let ue of student.ues; let last = last">
                        {{ ue.code }}<span *ngIf="!last">, </span>
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex flex-wrap gap-2">
                        <a [routerLink]="['/admin/students', student.id, 'edit']" class="rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200">Modifier</a>
                        <button (click)="deleteStudent(student.id)" class="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab === 'assign-grades'" class="space-y-6">
          <div class="rounded-3xl border border-red-200 bg-white p-6 shadow-lg shadow-red-100">
            <h2 class="mb-4 text-xl font-bold text-black">Attribuer une Note</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="mb-2 block text-sm font-semibold text-neutral-700">Sélectionner un Étudiant</label>
                <select
                  [(ngModel)]="selectedStudentId"
                  (change)="onStudentSelected()"
                  class="w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                >
                  <option value="">-- Sélectionner un étudiant --</option>
                  <option *ngFor="let student of students" [value]="student.id">
                    {{ student.user?.username }} (ID: {{ student.id }})
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-neutral-700">Sélectionner une UE</label>
                <select
                  [(ngModel)]="selectedUECode"
                  class="w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  [disabled]="selectedStudentUEs.length === 0"
                >
                  <option value="">-- Sélectionner une UE --</option>
                  <option *ngFor="let ue of selectedStudentUEs" [value]="ue.code">
                    {{ ue.code }} - {{ ue.titre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-2 block text-sm font-semibold text-neutral-700">Note (0-20)</label>
                <input
                  type="number"
                  [(ngModel)]="gradeValue"
                  min="0"
                  max="20"
                  placeholder="Ex: 15.5"
                  class="w-full rounded-lg border border-red-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div class="flex items-end">
                <button
                  (click)="assignGrade()"
                  [disabled]="!selectedStudentId || !selectedUECode || gradeValue === null || isLoadingGrade"
                  class="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span *ngIf="!isLoadingGrade">Attribuer la Note</span>
                  <span *ngIf="isLoadingGrade">Traitement...</span>
                </button>
              </div>
            </div>

            <div *ngIf="gradeSuccessMessage" class="mt-4 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
              <p class="font-semibold">✅ {{ gradeSuccessMessage }}</p>
            </div>

            <div *ngIf="gradeErrorMessage" class="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              <p class="font-semibold">❌ {{ gradeErrorMessage }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  activeTab: 'manage-students' | 'assign-grades' = 'manage-students';
  students: Student[] = [];
  selectedStudentId: number | null = null;
  selectedStudentUEs: UE[] = [];
  selectedUECode: string = '';
  gradeValue: number | null = null;
  isLoadingGrade: boolean = false;
  gradeSuccessMessage: string = '';
  gradeErrorMessage: string = '';
  studentMessage: string = '';
  studentErrorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService
  ) {
    this.loadStudents();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const roles = localStorage.getItem('roles');
    if (!roles?.includes('ROLE_ADMIN')) {
      window.location.href = '/';
    }
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des étudiants', err);
      }
    });
  }

  onStudentSelected(): void {
    if (this.selectedStudentId) {
      const student = this.students.find(s => s.id === this.selectedStudentId);
      this.selectedStudentUEs = student?.ues || [];
      this.selectedUECode = '';
      this.gradeValue = null;
    }
  }

  assignGrade(): void {
    if (!this.selectedStudentId || !this.selectedUECode || this.gradeValue === null) {
      this.gradeErrorMessage = 'Tous les champs sont requis';
      return;
    }

    this.isLoadingGrade = true;
    this.gradeErrorMessage = '';
    this.gradeSuccessMessage = '';

    const request = {
      studentId: this.selectedStudentId,
      ueCode: this.selectedUECode,
      valeur: this.gradeValue
    };

    this.gradeService.createOrUpdateGrade(request).subscribe({
      next: (data) => {
        this.isLoadingGrade = false;
        this.gradeSuccessMessage = `Note attribuée avec succès !`;
        this.gradeValue = null;
        this.selectedUECode = '';
        setTimeout(() => {
          this.gradeSuccessMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.isLoadingGrade = false;
        this.gradeErrorMessage = err.error?.message || 'Erreur lors de l\'attribution de la note';
        console.error('Erreur:', err);
      }
    });
  }

  deleteStudent(studentId?: number): void {
    if (!studentId) {
      return;
    }

    this.studentErrorMessage = '';
    this.studentMessage = '';

    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        this.studentMessage = 'Etudiant supprime avec succes.';
        this.loadStudents();
      },
      error: (err) => {
        this.studentErrorMessage = err.error || 'Impossible de supprimer cet etudiant.';
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/home']);
  }
}
