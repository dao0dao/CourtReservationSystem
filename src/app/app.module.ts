import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiInterceptor } from './api.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';

const INTERCEPT = { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    INTERCEPT
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
