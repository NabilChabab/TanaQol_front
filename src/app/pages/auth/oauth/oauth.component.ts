import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-oauth2-callback',
  template: '<p>Processing login...</p>',
})
export class OAuth2CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router , private authService : AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.authService.handleOAuth2Callback(token);
        this.router.navigate(['/']);
      } else {
        console.error('Missing token or refreshToken in the callback URL');
      }
    });
  }
}
