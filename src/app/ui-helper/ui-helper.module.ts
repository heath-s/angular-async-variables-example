import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ProgressSpinnerComponent } from './progress-spinner.component';
import { ProgressSpinnerService } from './progress-spinner.service';
import { SnackBarService } from './snack-bar.service';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  providers: [
    ConfirmDialogService,
    ProgressSpinnerService,
    SnackBarService
  ],
  exports: [
    ProgressSpinnerComponent
  ]
})
export class UiHelperModule { }
