import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsLoginGuard } from '../pages/is-login.guard';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private isLoginGuard: IsLoginGuard) { };

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const cloneReq = request.clone({
      withCredentials: environment.production ? false : true
    });
    return next.handle(cloneReq).pipe(
      catchError((err) => throwError(() => {
        if (err.status === 401 && err.error.session === 'fail') {
          this.isLoginGuard.logOut();
        }
        return new Error(err);
      }))
    );
  }
}
