import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';
import { UserState } from '../../../core/store/user/user.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessages: { [key: string]: string } = {};
  user$: Observable<UserState>;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ user: UserState }>
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
    this.user$ = this.store.select('user');
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      console.log('Current User State:', user);
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigate(['/']);
          setTimeout(()=>{
            window.location.reload();
          } , 1000);
        },
        error: (error) => {
          setTimeout(() => {
            this.loading = false;
          }, 3000);
          this.errorMessages = {};
          if (error.error) {
            const backendErrors = error.error;
            Object.keys(backendErrors).forEach((key) => {
              this.errorMessages[key] = backendErrors[key];
            });
          } else {
            this.errorMessages['global'] = 'Login failed';
          }
        },
      });
    }
  }
  loginWithGoogle(): void {
    this.authService.initiateGoogleLogin();
  }
}
