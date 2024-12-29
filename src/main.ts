import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { userReducer } from './app/core/store/user/user.reducer';
import { appInterceptor} from './app/core/interceptors/app.interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([appInterceptor])),
    provideAnimations(),
    provideStore({
      user: userReducer,
    }),
    provideStoreDevtools(),

    MessageService
  ]
});
