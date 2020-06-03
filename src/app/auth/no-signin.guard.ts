import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class NoSigninGuard implements CanActivate {

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.auth.isSignedIn) {
      this.router.navigateByUrl('/home');
      return false;
    } else {
      return true;
    }
  }

}
