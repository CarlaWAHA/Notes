import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../Services/studentService';
import { GradeService } from '../Services/gradeService';
import { UEService } from '../Services/ueService';
import { noteService } from '../Services/note.service';
import { Student } from '../models/student';
import { UE } from '../models/ue';
import { NoteModel } from '../models/note';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top,#fee2e2_0,#ffffff_45%,#fff7f7_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <h1 class="text-2xl font-black text-black">Tableau de Bord <span class="text-red-600">Admin</span></h1>
          <div class="flex items-center gap-2 text-sm font-semibold">
            <a href="/home" class="rounded-lg border border-red-200 px-3 py-2 hover:bg-red-50">Accueil</a>
            <a href="/admissions" class="rounded-lg border border-red-200 px-3 py-2 hover:bg-red-50">Admissions</a>
            <a href="/admin-space" class="rounded-lg border border-red-200 px-3 py-2 hover:bg-red-50">Admin</a>
            <button (click)="logout()" class="rounded-lg bg-black px-4 py-2 text-white hover:bg-red-600">Déconnexion</button>
          </div>
        </div>
      </header>

      <main class="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 md:px-8">
        <section class="rounded-2xl border border-red-200 bg-white p-4 shadow-sm">
          <div class="flex flex-wrap items-center gap-3">
            <button (click)="activeTab = 'manage-students'" [class.bg-red-600]="activeTab === 'manage-students'" [class.text-white]="activeTab === 'manage-students'" class="rounded-lg border border-red-200 px-4 py-2 font-semibold hover:bg-red-50">
              Gestion Etudiants
            </button>
            <button (click)="activeTab = 'manage-ues'" [class.bg-red-600]="activeTab === 'manage-ues'" [class.text-white]="activeTab === 'manage-ues'" class="rounded-lg border border-red-200 px-4 py-2 font-semibold hover:bg-red-50">
              Gestion UE
            </button>
            <button (click)="activeTab = 'assign-grades'" [class.bg-red-600]="activeTab === 'assign-grades'" [class.text-white]="activeTab === 'assign-grades'" class="rounded-lg border border-red-200 px-4 py-2 font-semibold hover:bg-red-50">
              Attribution Notes
            </button>
          </div>
        </section>

        <section *ngIf="activeTab === 'manage-students'" class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-2xl font-black text-black">Gestion des Etudiants</h2>
          </div>

          <div class="mb-6 rounded-xl border border-red-200 bg-red-50/40 p-5">
            <h3 class="text-lg font-bold text-black">Ajouter un etudiant</h3>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold">Username</label>
                <input [(ngModel)]="createUsername" type="text" class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 outline-none focus:border-red-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-semibold">Mot de passe</label>
                <input [(ngModel)]="createPassword" type="password" class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 outline-none focus:border-red-500" />
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2 text-sm font-semibold">UE affectees</p>
              <div class="grid gap-2 md:grid-cols-2">
                <label *ngFor="let ue of availableUEs" class="flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm">
                  <input type="checkbox" [checked]="isUESelectedInCreate(ue.code)" (change)="toggleUEInCreate(ue.code, $any($event.target).checked)" />
                  <span>{{ ue.code }} - {{ ue.titre }}</span>
                </label>
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2 text-sm font-semibold">Cours admin affectes</p>
              <div class="grid gap-2 md:grid-cols-2">
                <label *ngFor="let course of availableCourses" class="flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm">
                  <input type="checkbox" [checked]="isCourseSelectedInCreate(course.title)" (change)="toggleCourseInCreate(course.title, $any($event.target).checked)" />
                  <span>{{ course.title }}</span>
                </label>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button (click)="createStudentInline()" class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-black">Creer l'etudiant</button>
              <button (click)="resetCreateForm()" class="rounded-lg border border-black px-4 py-2 font-semibold hover:border-red-600 hover:text-red-600">Reinitialiser</button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-red-100 text-left text-sm uppercase tracking-wide text-red-700">
                  <th class="px-4 py-3">ID</th>
                  <th class="px-4 py-3">Username</th>
                  <th class="px-4 py-3">UE</th>
                  <th class="px-4 py-3">Cours</th>
                  <th class="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of students" class="border-b border-red-50 align-top">
                  <td class="px-4 py-3">{{ student.id }}</td>
                  <td class="px-4 py-3">{{ student.user?.username }}</td>
                  <td class="px-4 py-3">
                    <span *ngIf="(student.ues || []).length === 0" class="text-sm text-neutral-500">Aucune UE</span>
                    <span *ngFor="let ue of student.ues; let last = last" class="text-sm">
                      {{ ue.code }}<span *ngIf="!last">, </span>
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <span *ngIf="(student.courseTitles || []).length === 0" class="text-sm text-neutral-500">Aucun cours</span>
                    <span *ngFor="let title of student.courseTitles; let last = last" class="text-sm">
                      {{ title }}<span *ngIf="!last">, </span>
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button (click)="startEditStudent(student)" class="rounded-md border border-black px-3 py-1 text-sm font-semibold hover:border-red-600 hover:text-red-600">Modifier</button>
                      <button (click)="deleteStudent(student)" class="rounded-md bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-red-600">Supprimer</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="editingStudentId" class="mt-6 rounded-xl border border-red-200 bg-red-50/40 p-5">
            <h3 class="text-lg font-bold text-black">Modifier l'etudiant #{{ editingStudentId }}</h3>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-semibold">Username</label>
                <input [(ngModel)]="editUsername" type="text" class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 outline-none focus:border-red-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-semibold">Nouveau mot de passe (optionnel)</label>
                <input [(ngModel)]="editPassword" type="password" class="w-full rounded-lg border border-red-200 bg-white px-3 py-2 outline-none focus:border-red-500" />
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2 text-sm font-semibold">UE affectees</p>
              <div class="grid gap-2 md:grid-cols-2">
                <label *ngFor="let ue of availableUEs" class="flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm">
                  <input type="checkbox" [checked]="isUESelectedInEdit(ue.code)" (change)="toggleUEInEdit(ue.code, $any($event.target).checked)" />
                  <span>{{ ue.code }} - {{ ue.titre }}</span>
                </label>
              </div>
            </div>

            <div class="mt-4">
              <p class="mb-2 text-sm font-semibold">Cours admin affectes</p>
              <div class="grid gap-2 md:grid-cols-2">
                <label *ngFor="let course of availableCourses" class="flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-sm">
                  <input type="checkbox" [checked]="isCourseSelectedInEdit(course.title)" (change)="toggleCourseInEdit(course.title, $any($event.target).checked)" />
                  <span>{{ course.title }}</span>
                </label>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button (click)="saveStudentEdit()" class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-black">Enregistrer</button>
              <button (click)="cancelStudentEdit()" class="rounded-lg border border-black px-4 py-2 font-semibold hover:border-red-600 hover:text-red-600">Annuler</button>
            </div>
          </div>
        </section>

        <section *ngIf="activeTab === 'manage-ues'" class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 class="text-2xl font-black text-black">Gestion des UE</h2>

          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <input [(ngModel)]="ueCode" type="text" placeholder="Code UE (ex: STA104)" class="rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" />
            <input [(ngModel)]="ueTitle" type="text" placeholder="Titre UE" class="rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" />
            <button (click)="saveUE()" class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-black">{{ editingUEId ? 'Mettre a jour UE' : 'Ajouter UE' }}</button>
          </div>

          <div class="mt-5 overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-red-100 text-left text-sm uppercase tracking-wide text-red-700">
                  <th class="px-4 py-3">Code</th>
                  <th class="px-4 py-3">Titre</th>
                  <th class="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let ue of availableUEs" class="border-b border-red-50">
                  <td class="px-4 py-3 font-semibold text-black">{{ ue.code }}</td>
                  <td class="px-4 py-3">{{ ue.titre }}</td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button (click)="startEditUE(ue)" class="rounded-md border border-black px-3 py-1 text-sm font-semibold hover:border-red-600 hover:text-red-600">Modifier</button>
                      <button (click)="deleteUE(ue)" class="rounded-md bg-black px-3 py-1 text-sm font-semibold text-white hover:bg-red-600">Supprimer</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section *ngIf="activeTab === 'assign-grades'" class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 class="text-2xl font-black text-black">Attribuer une Note</h2>

          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Etudiant</label>
              <select [(ngModel)]="selectedStudentId" (change)="onStudentSelected()" class="w-full rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500">
                <option [ngValue]="null">-- Sélectionner un étudiant --</option>
                <option *ngFor="let student of students" [ngValue]="student.id">
                  {{ student.user?.username }} (ID: {{ student.id }})
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">UE</label>
              <select [(ngModel)]="selectedUECode" class="w-full rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" [disabled]="selectedStudentUEs.length === 0">
                <option value="">-- Sélectionner une UE --</option>
                <option *ngFor="let ue of selectedStudentUEs" [value]="ue.code">{{ ue.code }} - {{ ue.titre }}</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Note (0-20)</label>
              <input type="number" [(ngModel)]="gradeValue" min="0" max="20" class="w-full rounded-lg border border-red-200 bg-red-50/40 px-3 py-2 outline-none focus:border-red-500" />
            </div>

            <div class="flex items-end">
              <button (click)="assignGrade()" [disabled]="!selectedStudentId || !selectedUECode || gradeValue === null || isLoadingGrade" class="w-full rounded-lg bg-red-600 py-2 font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50">
                {{ isLoadingGrade ? 'Traitement...' : 'Attribuer la note' }}
              </button>
            </div>
          </div>

          <div *ngIf="gradeSuccessMessage" class="mt-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-green-700">
            {{ gradeSuccessMessage }}
          </div>

          <div *ngIf="gradeErrorMessage" class="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {{ gradeErrorMessage }}
          </div>
        </section>

        <div *ngIf="uiMessage" class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{{ uiMessage }}</div>
      </main>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  activeTab: 'manage-students' | 'manage-ues' | 'assign-grades' = 'manage-students';
  students: Student[] = [];
  availableUEs: UE[] = [];
  availableCourses: NoteModel[] = [];

  createUsername = '';
  createPassword = '';
  createUeCodes: string[] = [];
  createCourseTitles: string[] = [];

  editingStudentId: number | null = null;
  editUsername = '';
  editPassword = '';
  editUeCodes: string[] = [];
  editCourseTitles: string[] = [];

  ueCode = '';
  ueTitle = '';
  editingUEId: number | null = null;

  uiMessage = '';

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
    private ueService: UEService,
    private notesService: noteService
  ) {
    this.loadStudents();
    this.loadUEs();
    this.loadCourses();
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
        this.uiMessage = 'Impossible de charger les etudiants.';
      }
    });
  }

  loadUEs(): void {
    this.ueService.getAllUEs().subscribe({
      next: (data) => {
        this.availableUEs = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des UE', err);
        this.uiMessage = 'Impossible de charger les UE.';
      }
    });
  }

  loadCourses(): void {
    this.notesService.getAllNotes().subscribe({
      next: (data) => {
        this.availableCourses = data;
      },
      error: () => {
        this.availableCourses = [];
      }
    });
  }

  isUESelectedInCreate(code: string): boolean {
    return this.createUeCodes.includes(code);
  }

  toggleUEInCreate(code: string, checked: boolean): void {
    if (checked && !this.createUeCodes.includes(code)) {
      this.createUeCodes.push(code);
      return;
    }

    if (!checked) {
      this.createUeCodes = this.createUeCodes.filter((value) => value !== code);
    }
  }

  isCourseSelectedInCreate(title: string): boolean {
    return this.createCourseTitles.includes(title);
  }

  toggleCourseInCreate(title: string, checked: boolean): void {
    if (checked && !this.createCourseTitles.includes(title)) {
      this.createCourseTitles.push(title);
      return;
    }

    if (!checked) {
      this.createCourseTitles = this.createCourseTitles.filter((value) => value !== title);
    }
  }

  resetCreateForm(): void {
    this.createUsername = '';
    this.createPassword = '';
    this.createUeCodes = [];
    this.createCourseTitles = [];
  }

  createStudentInline(): void {
    if (!this.createUsername.trim() || !this.createPassword.trim() || this.createUeCodes.length === 0) {
      this.uiMessage = 'Username, mot de passe et au moins une UE sont obligatoires.';
      return;
    }

    this.studentService.createStudent({
      username: this.createUsername.trim(),
      password: this.createPassword,
      ueCodes: this.createUeCodes,
      courseTitles: this.createCourseTitles
    }).subscribe({
      next: () => {
        this.uiMessage = 'Etudiant cree avec succes.';
        this.resetCreateForm();
        this.loadStudents();
      },
      error: (err) => {
        console.error('Erreur creation etudiant', err);
        this.uiMessage = err?.error || 'Impossible de creer cet etudiant.';
      }
    });
  }

  startEditStudent(student: Student): void {
    this.editingStudentId = student.id ?? null;
    this.editUsername = student.user?.username || '';
    this.editPassword = '';
    this.editUeCodes = (student.ues || []).map((ue) => ue.code);
    this.editCourseTitles = [...(student.courseTitles || [])];
    this.uiMessage = '';
  }

  cancelStudentEdit(): void {
    this.editingStudentId = null;
    this.editUsername = '';
    this.editPassword = '';
    this.editUeCodes = [];
    this.editCourseTitles = [];
  }

  isUESelectedInEdit(code: string): boolean {
    return this.editUeCodes.includes(code);
  }

  toggleUEInEdit(code: string, checked: boolean): void {
    if (checked && !this.editUeCodes.includes(code)) {
      this.editUeCodes.push(code);
      return;
    }

    if (!checked) {
      this.editUeCodes = this.editUeCodes.filter((value) => value !== code);
    }
  }

  isCourseSelectedInEdit(title: string): boolean {
    return this.editCourseTitles.includes(title);
  }

  toggleCourseInEdit(title: string, checked: boolean): void {
    if (checked && !this.editCourseTitles.includes(title)) {
      this.editCourseTitles.push(title);
      return;
    }

    if (!checked) {
      this.editCourseTitles = this.editCourseTitles.filter((value) => value !== title);
    }
  }

  saveStudentEdit(): void {
    if (!this.editingStudentId) {
      return;
    }

    if (!this.editUsername.trim() || this.editUeCodes.length === 0) {
      this.uiMessage = 'Username et au moins une UE sont obligatoires.';
      return;
    }

    this.studentService.updateStudent(this.editingStudentId, {
      username: this.editUsername.trim(),
      password: this.editPassword.trim() || undefined,
      ueCodes: this.editUeCodes,
      courseTitles: this.editCourseTitles
    }).subscribe({
      next: () => {
        this.uiMessage = 'Etudiant mis a jour avec succes.';
        this.cancelStudentEdit();
        this.loadStudents();
      },
      error: (err) => {
        console.error('Erreur update etudiant', err);
        this.uiMessage = err?.error || 'Impossible de mettre a jour cet etudiant.';
      }
    });
  }

  deleteStudent(student: Student): void {
    if (!student.id) {
      return;
    }

    if (!confirm(`Supprimer l'etudiant ${student.user?.username || ''} ?`)) {
      return;
    }

    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.uiMessage = 'Etudiant supprime avec succes.';
        this.loadStudents();
      },
      error: (err) => {
        console.error('Erreur suppression etudiant', err);
        this.uiMessage = 'Impossible de supprimer cet etudiant.';
      }
    });
  }

  startEditUE(ue: UE): void {
    this.editingUEId = ue.id ?? null;
    this.ueCode = ue.code;
    this.ueTitle = ue.titre;
    this.uiMessage = '';
  }

  resetUEForm(): void {
    this.editingUEId = null;
    this.ueCode = '';
    this.ueTitle = '';
  }

  saveUE(): void {
    if (!this.ueCode.trim() || !this.ueTitle.trim()) {
      this.uiMessage = 'Code et titre UE sont obligatoires.';
      return;
    }

    const payload = { code: this.ueCode.trim(), titre: this.ueTitle.trim() };
    const request$ = this.editingUEId
      ? this.ueService.updateUE(this.editingUEId, payload)
      : this.ueService.createUE(payload);

    request$.subscribe({
      next: () => {
        this.uiMessage = this.editingUEId ? 'UE mise a jour.' : 'UE creee.';
        this.resetUEForm();
        this.loadUEs();
        this.loadCourses();
        this.loadStudents();
      },
      error: (err) => {
        console.error('Erreur sauvegarde UE', err);
        this.uiMessage = err?.error || 'Impossible de sauvegarder cette UE.';
      }
    });
  }

  deleteUE(ue: UE): void {
    if (!ue.id) {
      return;
    }

    if (!confirm(`Supprimer l'UE ${ue.code} ?`)) {
      return;
    }

    this.ueService.deleteUE(ue.id).subscribe({
      next: () => {
        this.uiMessage = 'UE supprimee avec succes.';
        this.loadUEs();
        this.loadStudents();
      },
      error: (err) => {
        console.error('Erreur suppression UE', err);
        this.uiMessage = 'Impossible de supprimer cette UE.';
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
