import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        this.authService.saveToken(data.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Login failed';
      }
    });
  }
}
