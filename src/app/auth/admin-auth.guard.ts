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
    return this.auth.getMe()
      .pipe(
        mergeMap((session) => session.isAdmin ?
          of(true) :
          this.goHome()
        ),
        catchError(() => this.goHome())
      );
  }

  canLoad(route: Route, segments: UrlSegment[]) {
    return this.auth.getMe()
      .pipe(
        mergeMap((session) => session.isAdmin ?
          of(true) :
          this.goHome()
        ),
        catchError(() => this.goHome()),
        take(1)
      );
  }

  private goHome() {
    this.router.navigateByUrl('/home');
    return of(false);
  }

}
