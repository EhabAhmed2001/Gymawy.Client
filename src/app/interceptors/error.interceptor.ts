import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
   const _router = inject(Router);
  const _toastrService = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
          //   if (error.error.errors) {
          //     const modelStateErrors = [];
          //     for (const key in error.error.errors) {
          //       if (error.error.errors[key])
          //         modelStateErrors.push(error.error.errors[key]);
          //     }
          //     throw modelStateErrors.flat();
          //   } else
          //    _toastrService.error(
          //       error.error,
          //       error.status.toString()
          //     );
          //  if (error.error.errors) {
          //     throw error.error;
          //   } else {
          //     _toastrService.error(error.error.message, error.error.statusCode);
          //   }
               _toastrService.error(
              error.error.errors,);
              console.log(error.error.errors);
                throw error.error.errors;


            break;

          case 401:
           _toastrService.error(
              error.error.message,
            );
            break;
          case 404:
            // _router.navigateByUrl('/notFound');
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            _router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            console.log(error);
            break;
        }
      }
      throw error;
    })
  );
};
