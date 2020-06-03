import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';

import { AdminUsersService } from '../admin-users.service';
import { ConfirmDialogService } from 'src/app/ui-helper/confirm-dialog.service';
import { SnackBarService } from 'src/app/ui-helper/snack-bar.service';
import User from '../user';

@Component({
  selector: 'app-admin-user-item-dialog',
  templateUrl: './admin-user-item-dialog.component.html',
  styleUrls: ['./admin-user-item-dialog.component.scss']
})
export class AdminUserItemDialogComponent implements OnDestroy, OnInit {

  item: User;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  SEPARATOR_KEY_CODES = [COMMA, ENTER];
  userForm: FormGroup;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly confirmDialog: ConfirmDialogService,
    private readonly dialog: MatDialogRef<AdminUserItemDialogComponent>,
    private readonly fb: FormBuilder,
    private readonly service: AdminUsersService,
    private readonly snackBar: SnackBarService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      nickname: ['', [Validators.required]],
      roles: [[]],
      password: ['']
    });

    this.loading$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((loading) => this.userForm[loading ? 'disable' : 'enable']());
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnInit() {
    if (this.isNewUser) {
      this.userForm.get('password').setValidators([Validators.required]);
    } else {
      this.userForm.get('password').disable();
    }
    this.userForm.patchValue(this.item);
  }

  addRole($event: MatChipInputEvent) {
    const roles = this.userForm.get('roles').value;

    const { input } = $event;
    let { value } = $event;
    value = value.trim();
    if (!value) {
      return;
    }

    const index = roles.indexOf(value);
    if (index === -1) {
      this.userForm.get('roles').setValue([...roles, value]);
    }
    input.value = '';
  }

  deleteItem() {
    this.confirmDialog.confirm('삭제하시겠습니까?')
      .pipe(filter((result) => !!result))
      .subscribe(() => {
        this.loading$.next(true);
        this.service.deleteItem(this.item.username)
          .pipe(
            finalize(() => this.loading$.next(false)),
            mergeMap(({ data: { deleted } }) => deleted ? of(true) : throwError(false)),
            takeUntil(this.unsubscribeAll$)
          )
          .subscribe(
            () => {
              this.snackBar.show('삭제하였습니다.');
              this.dialog.close(true);
            },
            () => this.snackBar.show('삭제할 수 없습니다.')
          );
      });
  }

  get isNewUser() {
    return !this.item.username;
  }

  onChangePasswordCheckbox($event: MatCheckboxChange) {
    const checked = $event.checked;
    this.userForm.get('password')[checked ? 'enable' : 'disable']();
    if (!checked) {
      this.userForm.get('password').setValue('');
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const { username, ...item } = this.userForm.value;

    const observable = this.isNewUser ?
      this.service.postItem({ username, ...item }) :
      this.service.putItem(this.item.username, item);

    this.loading$.next(true);
    observable
      .pipe(
        finalize(() => this.loading$.next(false)),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(
        () => {
          this.snackBar.show('저장하였습니다.');
          this.dialog.close(true);
        },
        () => this.snackBar.show('저장할 수 없습니다.')
      );
  }

  removeRole(role: string) {
    if (this.loading$.getValue()) {
      return;
    }

    const roles = this.userForm.get('roles').value;
    const index = roles.indexOf(role);
    if (index > -1) {
      roles.splice(index, 1);
      this.userForm.get('roles').setValue([...roles]);
    }
  }

}
