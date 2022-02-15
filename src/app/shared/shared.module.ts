import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptor } from './api.interceptor';
import { LoaderComponent } from './loader/loader.component';

const INTERCEPT = { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true };

@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoaderComponent
  ],
  providers: [
    INTERCEPT
  ]
})
export class SharedModule { }
