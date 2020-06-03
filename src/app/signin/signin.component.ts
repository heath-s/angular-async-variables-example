import { BehaviorSubject, Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AUTH_BROADCAST_TYPE, AuthService } from 'src/app/auth/auth.service';
import { SnackBarService } from 'src/app/ui-helper/snack-bar.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnDestroy {

  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  signinForm: FormGroup;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly auth: AuthService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly snackBar: SnackBarService
  ) {
    this.auth.broadcast$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((message) => {
        switch (message.type) {
          case AUTH_BROADCAST_TYPE.SIGNED_IN:
            this.router.navigateByUrl('/home');
            break;
        }
      });

    this.signinForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.loading$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((loading) => this.signinForm[loading ? 'disable' : 'enable']());
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  onSubmit() {
    if (this.signinForm.invalid) {
      return;
    }

    this.loading$.next(true);
    const { username, password } = this.signinForm.value;
    this.auth.signin(username, password)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe(
        () => { },
        () => this.snackBar.show('로그인할 수 없습니다. 아이디, 비밀번호를 확인하십시오.')
      );
  }

}
