import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {

  constructor(
    private ngZone: NgZone,
    private snackBar: MatSnackBar
  ) { }

  show(message: string, action = '', duration = 5000) {
    return this.ngZone.run(() =>
      this.snackBar.open(
        message, action,
        { duration, horizontalPosition: 'center', verticalPosition: 'bottom' }
      )
    );
  }

}
