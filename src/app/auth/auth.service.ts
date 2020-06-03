import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';

import { BaseApiService } from 'src/app/api/base-api.service';
import { environment } from 'src/environments/environment';
import Session from './session';

interface AuthBroadcastMessage {
  type: AUTH_BROADCAST_TYPE | AUTH_REQUEST_BROADCAST_TYPE;
  data?: any;
}

export enum AUTH_BROADCAST_TYPE {
  SIGNED_IN,
  SIGNED_OUT
}

export enum AUTH_REQUEST_BROADCAST_TYPE {
  SIGNOUT
}

interface SigninForm {
  username: string;
  password: string;
}

@Injectable()
export class AuthService extends BaseApiService {

  broadcast$: Subject<AuthBroadcastMessage> = new Subject();
  getMe$: Observable<Session>;
  request$: Subject<AuthBroadcastMessage> = new Subject();
  SESSION_STORAGE_JWT_KEY = environment.constants.SESSION_STORAGE_JWT_KEY;
  session$: BehaviorSubject<Session> = new BehaviorSubject(null);
  private signin$: Observable<Session>;
  private signinForm$: BehaviorSubject<SigninForm> = new BehaviorSubject(null);

  constructor(
    readonly http: HttpClient,
    private readonly ngZone: NgZone
  ) {
    super(http);

    this.getMe$ = this.get<{ data: Session }>({ url: '/auth/me' })
      .pipe(
        catchError(() => of({ data: null })),
        map(({ data }) => new Session(data)),
        tap((session) => this.session$.next(session)),
        share()
      );

    this.signin$ = this.signinForm$
      .pipe(
        filter((form) => !!form),
        switchMap(({ username, password }) =>
          this.post<{ data: { token: string } }>({ url: '/auth/signin' }, { username, password })
            .pipe(
              tap(({ data: { token }}) => this.saveToken(token)),
              mergeMap(() => this.getMe$),
              // if not admin, sign out
              /*
              map((session) => {
                if (!session.isAdmin) {
                  this.signout();
                  throw new Error();
                }
                return session;
              }),
              */
              tap(() => this.broadcast(AUTH_BROADCAST_TYPE.SIGNED_IN))
            )
        ),
        share()
      );
  }

  broadcast(type: AUTH_BROADCAST_TYPE, data?: any): void {
    this.broadcast$.next({ type, data });
  }

  getMe() {
    const session = this.session$.getValue();
    if (session) {
      return of(session);
    }

    return this.getMe$;
  }

  getToken() {
    return sessionStorage.getItem(this.SESSION_STORAGE_JWT_KEY);
  }

  hasRole(role: string) {
    return !!this.session$.getValue()?.hasRole(role);
  }

  get isAdmin() {
    return !!this.session$.getValue()?.isAdmin;
  }

  get isSignedIn() {
    return !!this.session$.getValue()?.isSignedIn;
  }

  get isUser() {
    return !!this.session$.getValue()?.isUser;
  }

  request(type: AUTH_REQUEST_BROADCAST_TYPE, data?: any): void {
    this.request$.next({ type, data });
  }

  signin(username: string, password: string) {
    this.signinForm$.next({ username, password });
    return this.signin$;
  }

  signout() {
    this.ngZone.run(() => this.broadcast(AUTH_BROADCAST_TYPE.SIGNED_OUT));
    this.session$.next(new Session());
    this.removeToken();
  }

  private saveToken(token: string) {
    sessionStorage.setItem(this.SESSION_STORAGE_JWT_KEY, token);
  }

  private removeToken() {
    sessionStorage.removeItem(this.SESSION_STORAGE_JWT_KEY);
  }

}
