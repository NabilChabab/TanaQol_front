import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserState } from '../../core/store/user/user.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  user$ : Observable<UserState>;
  username: string | null = null;
  role: string | null = null;
  constructor(private store : Store<{user : UserState}>) {
    this.user$ = this.store.select('user');
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      this.username = user.username;
      this.role = user.role;
    });
  }

}
