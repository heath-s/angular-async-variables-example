import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { catchError, mergeMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const { data: { roles } = { roles: null } } = route;

    return this.auth.getMe()
      .pipe(
        mergeMap((session) => {
          if (session.isAdmin) {
            return of(true);
          }

          if (!session.isUser) {
            return this.goHome();
          }

          if (!roles) {
            return of(true);
          }

          if (roles.some((role) => session.hasRole(role))) {
            return of(true);
          } else {
            return this.goHome();
          }
        }),
        catchError(() => this.goHome())
      );
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    const { data: { roles } = { roles: null } } = route;

    return this.auth.getMe()
      .pipe(
        mergeMap((session) => {
          if (session.isAdmin) {
            return of(true);
          }

          if (!session.isUser) {
            return this.goHome();
          }

          if (!roles) {
            return of(true);
          }

          if (roles.some((role) => session.hasRole(role))) {
            return of(true);
          } else {
            return this.goHome();
          }
        }),
        catchError(() => this.goHome()),
        take(1)
      );
  }

  private goHome() {
    this.router.navigateByUrl('/home');
    return of(false);
  }

}
