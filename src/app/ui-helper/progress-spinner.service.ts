import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class ProgressSpinnerService {

  spinner$: ReplaySubject<boolean> = new ReplaySubject();
  private keySet: Set<string> = new Set();

  hide(key: string): void {
    this.keySet.delete(key);
    this.setStatus();
  }

  show(key: string): void {
    this.keySet.add(key);
    this.setStatus();
  }

  private setStatus() {
    this.spinner$.next(this.keySet.size > 0);
  }

}
