import { format } from 'date-fns';
import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class SubServiceMatDateAdapter extends NativeDateAdapter {
  format(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }
}
