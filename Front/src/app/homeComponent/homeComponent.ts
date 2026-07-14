import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LoginComponent } from '../loginComponent/loginComponent';
import { RegisterComponent } from '../registerComponent/registerComponent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Tabs Navigation -->
        <div class="flex border-b border-slate-300 mb-8">
          <button
            (click)="activeTab = 'login'"
            [class.border-b-2]="activeTab === 'login'"
            [class.border-blue-600]="activeTab === 'login'"
            [class.text-blue-600]="activeTab === 'login'"
            [class.text-slate-600]="activeTab !== 'login'"
            class="flex-1 py-4 font-semibold transition"
          >
            Se Connecter
          </button>
          <button
            (click)="activeTab = 'register'"
            [class.border-b-2]="activeTab === 'register'"
            [class.border-blue-600]="activeTab === 'register'"
            [class.text-blue-600]="activeTab === 'register'"
            [class.text-slate-600]="activeTab !== 'register'"
            class="flex-1 py-4 font-semibold transition"
          >
            S'Inscrire
          </button>
        </div>

        <!-- Tab Content -->
        <div class="bg-white rounded-lg shadow-2xl p-8 border border-slate-200">
          <app-login-component *ngIf="activeTab === 'login'"></app-login-component>
          <app-register-component *ngIf="activeTab === 'register'"></app-register-component>
        </div>

        <p class="text-center text-slate-600 text-xs mt-6">
          © 2026 Notes App. Tous droits réservés.
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  activeTab: 'login' | 'register' = 'login';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      const roles = localStorage.getItem('roles');
      if (roles?.includes('ROLE_ADMIN')) {
        window.location.href = '/admin';
      } else if (roles?.includes('ROLE_STUDENT')) {
        window.location.href = '/student';
      }
    }
  }
}
