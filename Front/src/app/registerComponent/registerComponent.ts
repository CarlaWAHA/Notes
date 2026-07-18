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
        <h2 class="text-2xl font-bold text-black">Creation d'un compte etudiant</h2>
        <p class="mt-2 text-sm text-neutral-600">Seul un administrateur autorise peut creer les comptes.</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-semibold text-neutral-800">Email</label>
        <input
          type="email"
          [(ngModel)]="email"
          placeholder="etudiant@exemple.com"
          class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-semibold text-neutral-800">Mot de passe</label>
        <input
          type="password"
          [(ngModel)]="password"
          placeholder="••••••••"
          class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-semibold text-neutral-800">Selectionner les UE a suivre</label>
        <div class="space-y-2">
          <div *ngFor="let ue of ues" class="flex items-center">
            <input
              type="checkbox"
              [id]="'ue-' + ue.code"
              [(ngModel)]="selectedUEs[ue.code]"
              [ngModelOptions]="{standalone: true}"
              class="h-4 w-4 rounded text-red-600 focus:ring-red-500"
            />
            <label [for]="'ue-' + ue.code" class="ml-2 cursor-pointer text-sm text-neutral-700">
              {{ ue.code }} - {{ ue.titre }}
            </label>
          </div>
        </div>
      </div>

      <button
        (click)="registerStudent()"
        [disabled]="isLoading"
        class="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span *ngIf="!isLoading">Creer un compte etudiant</span>
        <span *ngIf="isLoading">Creation en cours...</span>
      </button>

      <div *ngIf="successMessage" class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700">
        <p class="font-semibold">Succes</p>
        <p class="text-sm mt-1">{{ successMessage }}</p>
      </div>

      <div *ngIf="errorMessage" class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
        <p class="font-semibold">Erreur</p>
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
