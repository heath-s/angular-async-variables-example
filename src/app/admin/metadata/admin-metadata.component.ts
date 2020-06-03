import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, finalize, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AdminMetadataItemDialogComponent } from './item-dialog/admin-metadata-item-dialog.component';
import { AdminMetadataService } from './admin-metadata.service';
import Metadata from './metadata';
import { ProgressSpinnerService } from 'src/app/ui-helper/progress-spinner.service';
import { SnackBarService } from 'src/app/ui-helper/snack-bar.service';

const TYPES = [
  'SubServiceBucket', 'SubServiceCategory', 'SubServiceChannel', 'SubServiceProduct'
];

@Component({
  selector: 'app-admin-metadata',
  templateUrl: './admin-metadata.component.html',
  styleUrls: ['./admin-metadata.component.scss']
})
export class AdminMetadataComponent implements OnDestroy {

  COLUMNS = ['type', 'uuid', 'actions'];
  list$: Observable<{ data: Metadata[] }>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  type$: BehaviorSubject<string> = new BehaviorSubject(null);
  TYPES = TYPES;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly dialog: MatDialog,
    private readonly progressSpinner: ProgressSpinnerService,
    private readonly service: AdminMetadataService,
    private readonly snackBar: SnackBarService
  ) {
    this.list$ = this.type$
      .pipe(
        filter((type) => !!type),
        tap(() => this.loading$.next(true)),
        switchMap((type) =>
          this.service.getList(type)
            .pipe(
              finalize(() => this.loading$.next(false)),
              catchError(() => of(null))
            )
        ),
        takeUntil(this.unsubscribeAll$),
        shareReplay(1)
      );
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  addItem() {
    const metadata = new Metadata();
    metadata.type = this.type$.getValue();
    this.openDialog(metadata).subscribe();
  }

  editItem({ type, uuid }: Metadata) {
    this.progressSpinner.show('open-metadata-item-dialog');
    this.service.getItem(type, uuid)
      .pipe(finalize(() => this.progressSpinner.hide('open-metadata-item-dialog')))
      .subscribe(
        ({ data }) => this.openDialog(data).subscribe(),
        () => this.snackBar.show('항목을 조회할 수 없습니다.')
      );
  }

  onChangeType(type: string) {
    this.type$.next(type);
  }

  openDialog(item: Metadata) {
    const dialogRef = this.dialog.open(AdminMetadataItemDialogComponent, { disableClose: true });
    dialogRef.componentInstance.item = item;
    return dialogRef.afterClosed()
      .pipe(tap((toReload) => toReload ? this.type$.next(this.type$.getValue()) : void 0));
  }

}
