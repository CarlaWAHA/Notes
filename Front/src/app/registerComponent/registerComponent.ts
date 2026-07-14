import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../Services/studentService';
import { UEService } from '../Services/ueService';
import { UE } from '../models/ue';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-slate-900">Créer un Compte Étudiant</h2>
        <p class="text-slate-600 text-sm mt-2">⚠️ Seul l'admin peut créer des comptes étudiants</p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
        <input
          type="email"
          [(ngModel)]="email"
          placeholder="etudiant@exemple.com"
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
        <input
          type="password"
          [(ngModel)]="password"
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50 hover:bg-white"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Sélectionner les UE à suivre</label>
        <div class="space-y-2">
          <div *ngFor="let ue of ues" class="flex items-center">
            <input
              type="checkbox"
              [id]="'ue-' + ue.code"
              [(ngModel)]="selectedUEs[ue.code]"
              [ngModelOptions]="{standalone: true}"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label [for]="'ue-' + ue.code" class="ml-2 text-sm text-slate-700 cursor-pointer">
              {{ ue.code }} - {{ ue.titre }}
            </label>
          </div>
        </div>
      </div>

      <button
        (click)="registerStudent()"
        [disabled]="isLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span *ngIf="!isLoading">Créer un Compte Étudiant</span>
        <span *ngIf="isLoading">⏳ Création en cours...</span>
      </button>

      <div *ngIf="successMessage" class="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
        <p class="font-semibold">✅ Succès</p>
        <p class="text-sm mt-1">{{ successMessage }}</p>
      </div>

      <div *ngIf="errorMessage" class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
        <p class="font-semibold">❌ Erreur</p>
        <p class="text-sm mt-1">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  selectedUEs: { [key: string]: boolean } = {};
  ues: UE[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private studentService: StudentService, private ueService: UEService) {
    this.loadUEs();
  }

  loadUEs(): void {
    this.ueService.getAllUEs().subscribe({
      next: (data) => {
        this.ues = data;
        // Initialize selectedUEs
        this.ues.forEach(ue => {
          this.selectedUEs[ue.code] = false;
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des UE', err);
      }
    });
  }

  registerStudent(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Email et mot de passe sont requis';
      return;
    }

    const selectedUECodes = Object.keys(this.selectedUEs).filter(code => this.selectedUEs[code]);
    if (selectedUECodes.length === 0) {
      this.errorMessage = 'Veuillez sélectionner au moins une UE';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request = {
      username: this.email,
      password: this.password,
      ueCodes: selectedUECodes
    };

    this.studentService.createStudent(request).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.successMessage = 'Compte étudiant créé avec succès ! L\'étudiant peut maintenant se connecter.';
        this.email = '';
        this.password = '';
        this.ues.forEach(ue => {
          this.selectedUEs[ue.code] = false;
        });
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création du compte étudiant';
        console.error('Erreur:', err);
      }
    });
  }
}
