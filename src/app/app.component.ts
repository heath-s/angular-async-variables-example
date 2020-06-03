import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { ApiErrorInterceptor, HTTP_ERRORS } from './api/api-error.interceptor';
import { AUTH_BROADCAST_TYPE, AUTH_REQUEST_BROADCAST_TYPE, AuthService } from './auth/auth.service';
import { ConfirmDialogService } from './ui-helper/confirm-dialog.service';
import { ProgressSpinnerService } from './ui-helper/progress-spinner.service';
import { SnackBarService } from './ui-helper/snack-bar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    private readonly apiError: ApiErrorInterceptor,
    private readonly auth: AuthService,
    private readonly confirmDialog: ConfirmDialogService,
    private readonly progressSpinner: ProgressSpinnerService,
    private readonly router: Router,
    private readonly snackBar: SnackBarService
  ) {
    this.auth.broadcast$.subscribe((message) => {
      switch (message.type) {
        case AUTH_BROADCAST_TYPE.SIGNED_IN:
          this.snackBar.show('로그인되었습니다.');
          break;

        case AUTH_BROADCAST_TYPE.SIGNED_OUT:
          if (this.auth.isSignedIn) {
            this.snackBar.show('로그아웃되었습니다.');
          }
          break;
      }
    });

    this.auth.request$.subscribe((message) => {
      switch (message.type) {
        case AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT:
          if (!this.auth.isSignedIn) {
            return;
          }

          this.confirmDialog.confirm('로그아웃하시겠습니까?')
            .pipe(filter((result) => !!result))
            .subscribe(() => this.auth.signout());
          break;
      }
    });

    this.apiError.broadcast$
      .subscribe((error) => {
        switch (error) {
          case HTTP_ERRORS.BAD_REQUEST:
            this.snackBar.show('요청이 잘못되었습니다.');
            break;

          case HTTP_ERRORS.UNAUTHENTICATED:
            if (this.auth.isSignedIn) {
              this.snackBar.show('세션이 만료되었습니다. 다시 로그인하십시오.');
              this.auth.signout();
            }
            break;

          case HTTP_ERRORS.INTERNAL_SERVER_ERROR:
            this.snackBar.show('에러가 발생하였습니다.');
            break;

          case HTTP_ERRORS.MAINTENANCE_IN_PROGRESS:
            this.snackBar.show('서버가 유지보수중입니다. 잠시후 다시 시도하십시오.');
            break;

          case HTTP_ERRORS.REQUEST_ABORTED:
            this.snackBar.show('요청이 취소되었습니다.');
            break;
        }
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        return this.progressSpinner.show('router');
      } else if (event instanceof NavigationCancel || event instanceof NavigationEnd || event instanceof NavigationError) {
        return this.progressSpinner.hide('router');
      }
    });
  }

  ngOnInit() {
    this.auth.getMe$.subscribe();
  }

}
