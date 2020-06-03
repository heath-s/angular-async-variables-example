import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ApiErrorInterceptor, HTTP_ERRORS } from 'src/app/api/api-error.interceptor';
import { AUTH_BROADCAST_TYPE, AUTH_REQUEST_BROADCAST_TYPE, AuthService } from 'src/app/auth/auth.service';
import Session from 'src/app/auth/session';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements AfterViewInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;
  session$: Observable<Session>;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private apiError: ApiErrorInterceptor,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
    this.auth.broadcast$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((message) => {
        switch (message.type) {
          case AUTH_BROADCAST_TYPE.SIGNED_OUT:
            this.router.navigateByUrl('/home');
            break;
        }
      });

    this.apiError.broadcast$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((error) => {
        switch (error) {
          case HTTP_ERRORS.UNAUTHENTICATED:
            this.router.navigateByUrl('/home');
            break;
        }
      });

    this.session$ = this.auth.session$
      .pipe(takeUntil(this.unsubscribeAll$));
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(() => this.drawer.close());
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  signout() {
    this.auth.request(AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT);
  }

}
