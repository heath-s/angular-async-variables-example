import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { ApiErrorInterceptor, HTTP_ERRORS } from 'src/app/api/api-error.interceptor';
import { AUTH_BROADCAST_TYPE, AUTH_REQUEST_BROADCAST_TYPE, AuthService } from 'src/app/auth/auth.service';
import Session from 'src/app/auth/session';

@Component({
  selector: 'app-sub-service',
  templateUrl: './sub-service.component.html',
  styleUrls: ['./sub-service.component.scss']
})
export class SubServiceComponent implements OnDestroy {

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

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  signout() {
    this.auth.request(AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT);
  }

}
