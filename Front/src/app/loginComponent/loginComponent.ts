import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../Services/authService';
import { AuthRequest } from '../models/auth-request';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './loginComponent.html',
  styleUrls: ['./loginComponent.css']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  model: AuthRequest = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;

  submit() {
    const normalizedUsername = this.model.username.trim().toLowerCase();
    const normalizedPassword = this.model.password;

    if (!normalizedUsername || !normalizedPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ username: normalizedUsername, password: normalizedPassword }).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        const roles = res.roles || ['ROLE_USER'];
        localStorage.setItem('username', res.username);
        localStorage.setItem('userId', String(res.userId));
        localStorage.setItem('token', res.token);
        localStorage.setItem('roles', JSON.stringify(roles));
        this.isLoading = false;
        if (roles.includes('ROLE_ADMIN')) {
          this.router.navigate(['/admin-space']);
          return;
        }

        this.router.navigate(['/student']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
      }
    });
  }
}
