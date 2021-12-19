import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CoachesComponent } from './coaches/coaches.component';
import { ApiInterceptor } from './api.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const INTERCEPT = { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CoachesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    INTERCEPT
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
