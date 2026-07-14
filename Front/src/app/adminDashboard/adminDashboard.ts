import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../Services/studentService';
import { GradeService } from '../Services/gradeService';
import { UEService } from '../Services/ueService';
import { Student } from '../models/student';
import { UE } from '../models/ue';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Navigation Header -->
      <nav class="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold">👨‍💼 Tableau de Bord Admin</h1>
          <button
            (click)="logout()"
            class="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto p-6">
        <!-- Tabs -->
        <div class="flex gap-4 mb-6 border-b border-slate-300">
          <button
            (click)="activeTab = 'manage-students'"
            [class.border-b-4]="activeTab === 'manage-students'"
            [class.border-indigo-600]="activeTab === 'manage-students'"
            [class.text-indigo-600]="activeTab === 'manage-students'"
            [class.text-slate-600]="activeTab !== 'manage-students'"
            class="pb-4 font-semibold transition"
          >
            📚 Gérer les Étudiants
          </button>
          <button
            (click)="activeTab = 'assign-grades'"
            [class.border-b-4]="activeTab === 'assign-grades'"
            [class.border-indigo-600]="activeTab === 'assign-grades'"
            [class.text-indigo-600]="activeTab === 'assign-grades'"
            [class.text-slate-600]="activeTab !== 'assign-grades'"
            class="pb-4 font-semibold transition"
          >
            📝 Attribuer des Notes
          </button>
        </div>

        <!-- Tab: Manage Students -->
        <div *ngIf="activeTab === 'manage-students'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Liste des Étudiants</h2>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">ID</th>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">Nom d'utilisateur</th>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">UE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let student of students" class="border-b border-slate-200 hover:bg-slate-50">
                    <td class="px-4 py-3 text-slate-700">{{ student.id }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ student.user?.username }}</td>
                    <td class="px-4 py-3 text-slate-700">
                      <span *ngFor="let ue of student.ues; let last = last">
                        {{ ue.code }}<span *ngIf="!last">, </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab: Assign Grades -->
        <div *ngIf="activeTab === 'assign-grades'" class="space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Attribuer une Note</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Sélectionner un Étudiant</label>
                <select
                  [(ngModel)]="selectedStudentId"
                  (change)="onStudentSelected()"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Sélectionner un étudiant --</option>
                  <option *ngFor="let student of students" [value]="student.id">
                    {{ student.user?.username }} (ID: {{ student.id }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Sélectionner une UE</label>
                <select
                  [(ngModel)]="selectedUECode"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  [disabled]="selectedStudentUEs.length === 0"
                >
                  <option value="">-- Sélectionner une UE --</option>
                  <option *ngFor="let ue of selectedStudentUEs" [value]="ue.code">
                    {{ ue.code }} - {{ ue.titre }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Note (0-20)</label>
                <input
                  type="number"
                  [(ngModel)]="gradeValue"
                  min="0"
                  max="20"
                  placeholder="Ex: 15.5"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div class="flex items-end">
                <button
                  (click)="assignGrade()"
                  [disabled]="!selectedStudentId || !selectedUECode || gradeValue === null || isLoadingGrade"
                  class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span *ngIf="!isLoadingGrade">Attribuer la Note</span>
                  <span *ngIf="isLoadingGrade">⏳ Traitement...</span>
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
  activeTab: 'manage-students' | 'assign-grades' = 'manage-students';
  students: Student[] = [];
  selectedStudentId: number | null = null;
  selectedStudentUEs: UE[] = [];
  selectedUECode: string = '';
  gradeValue: number | null = null;
  isLoadingGrade: boolean = false;
  gradeSuccessMessage: string = '';
  gradeErrorMessage: string = '';

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService,
    private ueService: UEService
  ) {
    this.loadStudents();
  }

  ngOnInit(): void {
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

  logout(): void {
    localStorage.clear();
    window.location.href = '/';
  }
}
