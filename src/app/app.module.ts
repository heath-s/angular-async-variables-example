import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ApiErrorInterceptor } from './api/api-error.interceptor';
import { ApiModule } from './api/api.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UiHelperModule } from './ui-helper/ui-helper.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    AppRoutingModule,
    ApiModule,
    AuthModule,
    UiHelperModule
  ],
  providers: [
    AuthService,
    ApiErrorInterceptor
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
