import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthenticationsService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthenticationsService, private router: Router) {}

  canActivate(): boolean | UrlTree {
      if (!this.authService.isTokenExpired()) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
  }
}
