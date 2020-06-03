import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AdminUserItemDialogComponent } from './item-dialog/admin-user-item-dialog.component';
import { AdminUsersService } from './admin-users.service';
import { ProgressSpinnerService } from 'src/app/ui-helper/progress-spinner.service';
import { SnackBarService } from 'src/app/ui-helper/snack-bar.service';
import User from './user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnDestroy {

  COLUMNS = ['username', 'nickname', 'roles', 'actions'];
  list$: Observable<{ data: User[] }>;
  load$: BehaviorSubject<void> = new BehaviorSubject(null);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly dialog: MatDialog,
    private readonly progressSpinner: ProgressSpinnerService,
    private readonly service: AdminUsersService,
    private readonly snackBar: SnackBarService
  ) {
    this.list$ = this.load$
      .pipe(
        tap(() => this.loading$.next(true)),
        switchMap(() =>
          this.service.getList()
            .pipe(
              finalize(() => this.loading$.next(false)),
              catchError(() => of(null))
            )
        ),
        takeUntil(this.unsubscribeAll$),
        shareReplay(1)
      );

    this.load$.next();
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  addItem() {
    this.openDialog(new User()).subscribe();
  }

  editItem({ username }: User) {
    this.progressSpinner.show('open-user-item-dialog');
    this.service.getItem(username)
      .pipe(finalize(() => this.progressSpinner.hide('open-user-item-dialog')))
      .subscribe(
        ({ data }) => this.openDialog(data).subscribe(),
        () => this.snackBar.show('항목을 조회할 수 없습니다.')
      );
  }

  openDialog(item: User) {
    const dialogRef = this.dialog.open(AdminUserItemDialogComponent, { disableClose: true });
    dialogRef.componentInstance.item = item;
    return dialogRef.afterClosed()
      .pipe(tap((toReload) => toReload ? this.load$.next() : void 0));
  }

}
