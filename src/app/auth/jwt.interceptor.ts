import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private readonly service: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.service.getToken();
    if (!token) {
      return next.handle(request);
    }

    return next.handle(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }

}
