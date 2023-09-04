import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthenticationsService } from './authentication.service';

@Injectable()
export class TokenHandlerInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationsService){}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          // Verificar si la cabecera existe
          if (event.headers.has('Authorization')) {
            var token = event.headers.get('Authorization');
            this.authService.setToken(token);
          }
        }
      })
    );
  }
}
