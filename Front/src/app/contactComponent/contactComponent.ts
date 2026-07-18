import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../Services/contactService';
import { EditableTextComponent } from '../editableTextComponent/editableTextComponent';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, EditableTextComponent],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#fecaca_0,#ffffff_40%,#fff1f2_100%)] text-neutral-900">
      <header class="border-b border-red-100 bg-white/95">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="/home" class="text-xl font-black text-black">TRUST <span class="text-red-600">CAMPUS</span></a>
          <nav class="flex gap-5 text-sm font-semibold">
            <a href="/home" class="hover:text-red-600">Accueil</a>
            <a href="/about" class="hover:text-red-600">A propos</a>
            <a href="/programs" class="hover:text-red-600">UE & parcours</a>
            <a href="/admissions" class="hover:text-red-600">Admissions</a>
            <a *ngIf="isAdmin" href="/admin-space" class="hover:text-red-600">Admin</a>
          </nav>
        </div>
      </header>

      <main class="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
        <section class="space-y-5">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Contact</p>
          <h1 class="text-4xl font-black text-black md:text-5xl">Parlons de votre dossier academique</h1>
          <app-editable-text
            [isAdmin]="isAdmin"
            contentKey="tc.contact.intro"
            defaultValue="L'equipe Trust Campus vous repond pour les questions d'inscription, de transfert ECTS, de cours du soir et de formation a distance."
          ></app-editable-text>
          <div class="rounded-2xl border border-red-100 bg-white p-5">
            <p class="text-sm text-neutral-700"><strong>Etablissement:</strong> Trust Campus</p>
            <p class="text-sm text-neutral-700"><strong>Email:</strong> contact@trustcampus.org</p>
            <p class="text-sm text-neutral-700"><strong>Disponibilite:</strong> Lundi au Samedi</p>
          </div>
        </section>

        <section class="rounded-3xl border border-red-200 bg-white p-6 shadow-2xl shadow-red-100">
          <form (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Nom complet</label>
              <input
                type="text"
                [(ngModel)]="model.fullName"
                name="fullName"
                required
                class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Email</label>
              <input
                type="email"
                [(ngModel)]="model.email"
                name="email"
                required
                class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Sujet</label>
              <input
                type="text"
                [(ngModel)]="model.subject"
                name="subject"
                required
                class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-semibold text-neutral-800">Message</label>
              <textarea
                [(ngModel)]="model.message"
                name="message"
                required
                rows="6"
                class="w-full rounded-xl border border-red-200 bg-red-50/40 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
              ></textarea>
            </div>

            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span *ngIf="!isLoading">Envoyer le message</span>
              <span *ngIf="isLoading">Envoi en cours...</span>
            </button>

            <div *ngIf="successMessage" class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700">
              {{ successMessage }}
            </div>

            <div *ngIf="errorMessage" class="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {{ errorMessage }}
            </div>
          </form>
        </section>
      </main>
    </div>
  `,
  styles: []
})
export class ContactComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  isAdmin = false;
  model = {
    fullName: '',
    email: '',
    subject: '',
    message: ''
  };

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private readonly contactService: ContactService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      this.isAdmin = roles.includes('ROLE_ADMIN');
    } catch {
      this.isAdmin = false;
    }
  }

  submit(): void {
    if (!this.model.fullName || !this.model.email || !this.model.subject || !this.model.message) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.successMessage = '';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.contactService.sendContactMessage(this.model).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Votre message a bien ete envoye a Trust Campus.';
        this.model = { fullName: '', email: '', subject: '', message: '' };
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || "Impossible d'envoyer le message pour le moment.";
      }
    });
  }
}
