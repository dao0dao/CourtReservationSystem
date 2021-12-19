import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoachesComponent } from './coaches/coaches.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'coaches', component: CoachesComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
