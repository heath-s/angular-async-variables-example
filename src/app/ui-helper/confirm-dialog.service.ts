import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable()
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog,
    private ngZone: NgZone,
  ) { }

  confirm(message: string) {
    return this.ngZone.run(() => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, { disableClose: true });
      dialogRef.componentInstance.message = message;
      return dialogRef.afterClosed();
    });
  }

}
