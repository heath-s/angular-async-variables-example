import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <mat-dialog-content>{{ message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>취소</button>
      <button mat-flat-button [mat-dialog-close]="true" color="primary">확인</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-height: 36px;
      min-width: 240px;
    }
  `]
})
export class ConfirmDialogComponent {

  message: string;

}
