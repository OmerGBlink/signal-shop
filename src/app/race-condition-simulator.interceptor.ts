import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { defer, delay, Observable } from 'rxjs';

@Injectable()
export class RaceConditionSimulatorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return defer(() => next.handle(request).pipe(delay(Math.random() * 1000)));
  }
}
