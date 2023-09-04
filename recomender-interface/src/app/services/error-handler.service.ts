import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationsService } from './authentication.service';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationsService){}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401 || error.status === 403) {
          // Ejecutar la funcionalidad para el error 401
          this.handleUnauthorizedError();
        }

        return throwError(error);
      })
    );
  }

  private handleUnauthorizedError(): void {
    this.authService.removeToken();
    window.location.reload()
  }
}

