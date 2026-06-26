import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/authService';
import { LoginRequest } from '../models/loginRequest';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './loginComponent.html',
  styleUrls: ['./loginComponent.css']
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  model: LoginRequest = {
    username: '',
    password: ''
  };

  submit() {
    next: (token: string) => {
  console.log("TOKEN :", token);

  localStorage.setItem("username", this.model.username);
  localStorage.setItem("token", token);
  localStorage.setItem("roles", JSON.stringify(["ROLE_USER"]));

  this.router.navigate(['/notes']);
},
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }
}