import { Observable, Subject } from 'rxjs';
import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { AUTH_REQUEST_BROADCAST_TYPE, AuthService } from 'src/app/auth/auth.service';
import Session from 'src/app/auth/session';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  AVAILABLE_ROLES = [
    {
      role: 'admin',
      links: [
        { title: '관리자', link: '/admin' }
      ]
    },
    {
      role: 'sub-service',
      links: [
        { title: 'SubService', link: '/sub-service/dashboard' }
      ]
    }
  ];
  session$: Observable<Session>;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(private readonly auth: AuthService) {
    this.session$ = this.auth.session$
      .pipe(takeUntil(this.unsubscribeAll$));
  }

  signout() {
    this.auth.request(AUTH_REQUEST_BROADCAST_TYPE.SIGNOUT);
  }

}
