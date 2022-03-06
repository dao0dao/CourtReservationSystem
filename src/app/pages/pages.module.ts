import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { CoachesComponent } from './coaches/coaches.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IsLoginGuard } from './is-login.guard';
import { ListComponent } from './coaches/list/list.component';
import { AddComponent } from './coaches/add/add.component';
import { PlayersComponent } from './players/players.component';
import { AddPlayerComponent } from './players/add-player/add-player.component';
import { WeekComponent } from './players/week/week.component';
import { OpponentComponent } from './players/opponent/opponent.component';
import { PlayersListComponent } from './players/players-list/players-list.component';
import { SearchingService } from './players/searching.service';
import { SearchWeekComponent } from './players/search-week/search-week.component';



@NgModule({
  declarations: [
    PagesComponent,
    CoachesComponent,
    LoginComponent,
    ListComponent,
    AddComponent,
    PlayersComponent,
    AddPlayerComponent,
    WeekComponent,
    OpponentComponent,
    PlayersListComponent,
    SearchWeekComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'users', component: CoachesComponent, canActivate: [IsLoginGuard] },
      { path: 'players', component: PlayersComponent, canActivate: [IsLoginGuard] },
    ])
  ],
  exports: [
    PagesComponent
  ],
  providers: [
    SearchingService
  ]
})
export class PagesModule { }
