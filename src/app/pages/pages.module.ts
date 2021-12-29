import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { CoachesComponent } from './coaches/coaches.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IsLoginGuard } from './is-login.guard';
import { ListComponent } from './coaches/list/list.component';



@NgModule({
  declarations: [
    PagesComponent,
    CoachesComponent,
    LoginComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'users', component: CoachesComponent, canActivate: [IsLoginGuard] }
    ])
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }
