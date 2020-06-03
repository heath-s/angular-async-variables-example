import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ApiErrorInterceptor } from './api-error.interceptor';
import { BaseApiService } from './base-api.service';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    BaseApiService,

    { provide: HTTP_INTERCEPTORS, useExisting: ApiErrorInterceptor, multi: true }
  ]
})
export class ApiModule { }
