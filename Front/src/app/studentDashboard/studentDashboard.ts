import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StudentService } from '../Services/studentService';
import { GradeService } from '../Services/gradeService';
import { Student } from '../models/student';
import { Grade } from '../models/grade';
import { UE } from '../models/ue';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <!-- Navigation Header -->
      <nav class="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold">👨‍🎓 Mon Espace Personnel</h1>
          <button
            (click)="logout()"
            class="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto p-6">
        <div *ngIf="isLoading" class="text-center py-8">
          <p class="text-slate-600">Chargement de vos informations...</p>
        </div>

        <div *ngIf="!isLoading" class="space-y-6">
          <!-- Student Info -->
          <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-2">Profil</h2>
            <p class="text-slate-700">
              <strong>Utilisateur:</strong> {{ currentUsername }}
            </p>
          </div>

          <!-- UEs -->
          <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Mes Unités d'Enseignement (UE)</h2>

            <div *ngIf="studentUEs.length === 0" class="text-center py-8">
              <p class="text-slate-600">Vous n'êtes inscrit à aucune UE pour le moment.</p>
            </div>

            <div *ngIf="studentUEs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                *ngFor="let ue of studentUEs"
                (click)="selectUE(ue)"
                [class.ring-2]="selectedUE?.id === ue.id"
                [class.ring-emerald-600]="selectedUE?.id === ue.id"
                class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 cursor-pointer hover:shadow-md transition border border-emerald-200"
              >
                <div class="font-bold text-emerald-900">{{ ue.code }}</div>
                <div class="text-sm text-emerald-800 mt-2">{{ ue.titre }}</div>
                <div class="mt-3 pt-3 border-t border-emerald-200">
                  <div class="text-lg font-bold text-emerald-600">
                    {{ getGradeForUE(ue.code) ? getGradeForUE(ue.code) + '/20' : 'N/A' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected UE Details -->
          <div *ngIf="selectedUE" class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">
              Détails de {{ selectedUE.code }}
            </h2>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-slate-600 text-sm">Code UE</p>
                <p class="text-lg font-semibold text-slate-900">{{ selectedUE.code }}</p>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Titre</p>
                <p class="text-lg font-semibold text-slate-900">{{ selectedUE.titre }}</p>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Votre Note</p>
                <p class="text-3xl font-bold text-emerald-600">
                  {{ getGradeForUE(selectedUE.code) ? getGradeForUE(selectedUE.code) : 'Non attribuée' }}/20
                </p>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Statut</p>
                <p class="text-lg font-semibold" [class.text-green-600]="getGradeForUE(selectedUE.code)" [class.text-yellow-600]="!getGradeForUE(selectedUE.code)">
                  {{ getGradeForUE(selectedUE.code) ? '✅ Noté' : '⏳ En attente' }}
                </p>
              </div>
            </div>
          </div>

          <!-- All Grades Summary -->
          <div class="bg-white rounded-lg shadow-md p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Résumé de vos Notes</h2>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">Code UE</th>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">Titre</th>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">Note</th>
                    <th class="text-left px-4 py-3 font-semibold text-slate-900">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let ue of studentUEs" class="border-b border-slate-200 hover:bg-slate-50">
                    <td class="px-4 py-3 text-slate-700 font-semibold">{{ ue.code }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ ue.titre }}</td>
                    <td class="px-4 py-3 text-slate-700">
                      {{ getGradeForUE(ue.code) ? getGradeForUE(ue.code) + '/20' : 'N/A' }}
                    </td>
                    <td class="px-4 py-3">
                      <span *ngIf="getGradeForUE(ue.code)" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ✅ Noté
                      </span>
                      <span *ngIf="!getGradeForUE(ue.code)" class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⏳ En attente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentDashboardComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  isLoading: boolean = true;
  currentUsername: string = '';
  studentUEs: UE[] = [];
  grades: Grade[] = [];
  selectedUE: UE | null = null;

  constructor(
    private studentService: StudentService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isLoading = false;
      return;
    }

    const roles = localStorage.getItem('roles');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!roles?.includes('ROLE_STUDENT')) {
      window.location.href = '/';
    }

    if (userId) {
      this.currentUsername = username || 'Étudiant';
      this.loadStudentData(parseInt(userId));
    }
  }

  loadStudentData(userId: number): void {
    this.studentService.getStudentById(userId).subscribe({
      next: (student) => {
        this.studentUEs = student.ues || [];
        this.loadGrades(student.id!);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données étudiant', err);
        this.isLoading = false;
      }
    });
  }

  loadGrades(studentId: number): void {
    this.gradeService.getStudentGradesByStudentId(studentId).subscribe({
      next: (data) => {
        this.grades = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notes', err);
        this.isLoading = false;
      }
    });
  }

  selectUE(ue: UE): void {
    this.selectedUE = ue;
  }

  getGradeForUE(ueCode: string): number | undefined {
    const grade = this.grades.find(g => g.ue?.code === ueCode);
    return grade?.valeur;
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/';
  }
}
