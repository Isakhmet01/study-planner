import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup() {
    this.authService.signup(this.username, this.password).subscribe({
      next: (data: any) => {
        this.authService.saveToken(data.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'Signup failed';
      }
    });
  }
}
