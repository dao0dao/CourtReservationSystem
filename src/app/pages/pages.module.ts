import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { TimetableComponent } from './timetable/timetable.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimetableModalComponent } from './timetable/timetable-modal/timetable-modal.component';
import { DeleteModalComponent } from './timetable/delete-modal/delete-modal.component';



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
    SearchWeekComponent,
    TimetableComponent,
    TimetableModalComponent,
    DeleteModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'users', component: CoachesComponent, canActivate: [IsLoginGuard] },
      { path: 'players', component: PlayersComponent, canActivate: [IsLoginGuard] },
      { path: 'timetable', component: TimetableComponent, canActivate: [IsLoginGuard] },
    ]),
    DragDropModule,
    MatDatepickerModule
  ],
  exports: [
    PagesComponent
  ],
  providers: [
    SearchingService,
    DatePipe
  ]
})
export class PagesModule { }
