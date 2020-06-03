import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Category from '../types/category';
import Channel from '../types/channel';
import Condition from '../types/condition';
import Filter from '../types/filter';
import Product from '../types/product';
import { SubServiceService } from '../sub-service.service';

@Component({
  selector: 'app-sub-service-filter',
  templateUrl: './sub-service-filter.component.html',
  styleUrls: ['./sub-service-filter.component.scss']
})
export class SubServiceFilterComponent implements OnInit, OnDestroy {

  @Input() filter$: BehaviorSubject<Filter>;
  @Input() loading$: BehaviorSubject<boolean>;
  @Output() filterClose: EventEmitter<void> = new EventEmitter();
  categories$: Observable<Category[]>;
  category$: BehaviorSubject<Category> = new BehaviorSubject(null);
  channels$: Observable<Channel[]>;
  channel$: BehaviorSubject<Channel> = new BehaviorSubject(null);
  conditions$: BehaviorSubject<Condition[]> = new BehaviorSubject([]);
  DATE_MAX: Date;
  filterForm: FormGroup;
  products$: Observable<Product[]>;
  product$: BehaviorSubject<Product> = new BehaviorSubject(null);
  private unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: SubServiceService
  ) {
    this.channels$ = this.service.getChannels()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        catchError(() => of([])),
        shareReplay(1)
      );
    this.categories$ = this.service.getCategories()
      .pipe(
        takeUntil(this.unsubscribeAll$),
        catchError(() => of([])),
        shareReplay(1)
      );
    this.products$ = this.category$.pipe(
      switchMap((category) => category ?
        this.service.getProductsByCategory(this.channel$.getValue(), category) :
        of(null)
      ),
      takeUntil(this.unsubscribeAll$),
      catchError(() => of([])),
      shareReplay(1)
    );

    const now = new Date();
    const noon = new Date(now);
    noon.setHours(12, 0, 0, 0);

    const to = endOfDay(subDays(now, 1 + (now < noon ? 1 : 0)));
    this.DATE_MAX = new Date(to);
    this.filterForm = this.fb.group({
      from: [null as Date, [Validators.required]],
      to: [to as Date, [Validators.required]],
      conditions: [null as Condition[], [Validators.required]]
    });
    this.setPeriod(91);

    this.conditions$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((conditions) =>
        this.filterForm.patchValue({ conditions: conditions && conditions.length ? conditions : null })
      );
  }

  ngOnDestroy() {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnInit() {
    this.loading$
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((loading) => this.filterForm[loading ? 'disable' : 'enable']());
  }

  addCondition() {
    const channel = this.channel$.getValue();
    const conditions = this.conditions$.getValue();
    const product = this.product$.getValue();

    if (!product) {
      return;
    }

    const existence = conditions.some((f) => f.channel.uuid === channel.uuid && f.product.uuid === product.uuid);
    if (existence) {
      return;
    }

    conditions.push(new Condition(channel, product));
    this.conditions$.next(conditions);

    this.channel$.next(null);
    this.category$.next(null);
    this.product$.next(null);
  }

  onConditionRemoved(condition: Condition) {
    const conditions = this.conditions$.getValue();
    conditions.splice(conditions.indexOf(condition), 1);
    this.conditions$.next(conditions);
  }

  onSubmit() {
    if (this.filterForm.invalid) {
      return;
    }

    const { from, to, conditions } = this.filterForm.value;
    this.filter$.next(new Filter(from, to, conditions));
  }

  selectCategory(category: Category) {
    this.category$.next(category);
    this.selectProduct(null);
  }

  selectChannel(channel: Channel) {
    this.channel$.next(channel);
    this.selectProduct(null);
  }

  selectProduct(product: Product) {
    this.product$.next(product);
  }

  setPeriod(amount: number) {
    const to = new Date(this.filterForm.get('to').value);
    const from = subDays(startOfDay(new Date(to)), amount - 1);
    this.filterForm.patchValue({ from });
  }

}
