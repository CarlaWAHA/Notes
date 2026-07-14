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
    if (!this.model.username || !this.model.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.model).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userId', String(res.userId));
        localStorage.setItem('token', res.token);
        localStorage.setItem('roles', JSON.stringify(res.roles || ['ROLE_USER']));
        this.isLoading = false;
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.isLoading = false;
        this.errorMessage = 'Nom d’utilisateur ou mot de passe incorrect.';
      }
    });
  }
}
