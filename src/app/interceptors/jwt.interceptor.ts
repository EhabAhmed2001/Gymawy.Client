import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const AuthUrl = environment.apiUrl;
  if(req.url.includes(AuthUrl)){

    const _authService = inject(AuthService);

    _authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${user.token}`),
          });
        }
      },
    });
  }

  return next(req);
};
