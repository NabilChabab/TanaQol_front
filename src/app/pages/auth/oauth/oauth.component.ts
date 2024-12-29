import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oauth2-callback',
  template: '<p>Processing login...</p>',
})
export class OAuth2CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];

      if (token) {
        // Save token (localStorage or sessionStorage)
        localStorage.setItem('authToken', token);

        // Redirect to home page or any other page
        this.router.navigate(['/']);
      } else {
        // Handle error (e.g., token missing)
        console.error('No token found in the callback URL');
      }
    });
  }
}
