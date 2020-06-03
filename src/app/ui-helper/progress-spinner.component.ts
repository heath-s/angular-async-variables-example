import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProgressSpinnerService } from './progress-spinner.service';

@Component({
  selector: 'app-progress-spinner',
  template: `
    <div *ngIf="shown$ | async" class="container">
      <mat-progress-spinner mode="indeterminate" color="accent"></mat-progress-spinner>
    </div>
  `,
  styles: [`
    .container {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      background-position: center;
      background-repeat: no-repeat;
      bottom: 0;
      display: flex;
      justify-content: center;
      left: 0;
      opacity: 1;
      pointer-events: all;
      position: fixed;
      right: 0;
      top: 0;
      transition: opacity 0.1s ease;
      z-index: 1000;
    }
  `]
})
export class ProgressSpinnerComponent implements OnDestroy {

  shown$: Observable<boolean>;
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(private service: ProgressSpinnerService) {
    this.shown$ = this.service.spinner$
      .pipe(takeUntil(this.unsubscribeAll$));
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

}
