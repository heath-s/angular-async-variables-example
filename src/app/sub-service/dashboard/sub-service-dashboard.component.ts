import { BehaviorSubject, Observable, Subject, zip, of } from 'rxjs';
import { catchError, filter, finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import { MatSidenav } from '@angular/material/sidenav';

import { DashboardDrawn } from '../types/dashboard-drawn';
import Filter from '../types/filter';
import getDashboardDrawn from './get-dashboard-drawn';
import { SubServiceService } from '../sub-service.service';

@Component({
  selector: 'app-sub-service-dashboard',
  templateUrl: './sub-service-dashboard.component.html',
  styleUrls: ['./sub-service-dashboard.component.scss']
})
export class SubServiceDashboardComponent implements OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;
  dashboardDrawn$: Observable<DashboardDrawn[]>;
  filter$: BehaviorSubject<Filter> = new BehaviorSubject(null);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(private readonly service: SubServiceService) {
    this.dashboardDrawn$ = this.filter$
      .pipe(
        filter((value) => !!value),
        tap(() => this.loading$.next(true)),
        tap(() => this.drawer.close()),
        switchMap((value) =>
          zip(...value.conditions.map((condition, index) =>
            this.service.getDashboardDataByProduct(condition.product, value.from, value.to)
              .pipe(map(({ data }) => getDashboardDrawn(data, value.conditions[index].product))
          )))
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

  getFormattedDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }

  onFilterClose() {
    this.drawer.close();
  }
}
