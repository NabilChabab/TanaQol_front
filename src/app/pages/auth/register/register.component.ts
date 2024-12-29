import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessages: { [key: string]: string } = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roles: [['ADMIN' , 'CUSTOMER']],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: error => {
          this.errorMessages = {};
          if (error.error) {
            const backendErrors = error.error;
            Object.keys(backendErrors).forEach(key => {
              this.errorMessages[key] = backendErrors[key];
            });
          } else {
            this.errorMessages['global'] = 'Registration failed';
          }
        },
      });
    }
  }

  loginWithGoogle(): void {
    this.authService.initiateGoogleLogin();
  }

  ngOnInit(): void {}
}
