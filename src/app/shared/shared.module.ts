import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptor } from './api.interceptor';

const INTERCEPT = { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true };

@NgModule({
  declarations: [],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    INTERCEPT
  ]
})
export class SharedModule { }
