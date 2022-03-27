import { Component, OnInit } from '@angular/core';
import { TimeTable } from './intefaces';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  environment = environment;

  constructor(private api: ApiService, private DatePipe: DatePipe) { }

  timetable: TimeTable[] = [{ label: '00:00' }];
  isModal: boolean = false;
  modalAction: 'new' | 'edit' | undefined = undefined;
  date: string = '';

  players: Player[] = [];

  ngOnInit(): void {
    this.date = this.DatePipe.transform(Date.now(), 'YYYY-MM-dd')!;
    this.api.getAllPlayers().subscribe({
      next: (res) => { this.players = res; }
    });
    let time: number = 0;
    for (let i = 0; i < 47; i++) {
      time += 0.5;
      let hour: string = '';
      if (time < 10) {
        hour = '0' + Math.trunc(time) + ':';
      } else {
        hour = Math.trunc(time) + ':';
      }
      if (time % 1) {
        hour = hour + '30';
      } else {
        hour = hour + '00';
      }
      this.timetable.push({ label: hour });
    }
  }

  newReservation() {
    this.isModal = true;
    this.modalAction = 'new';
  }

  editReservation() {
    this.isModal = true;
    this.modalAction = 'edit';
  }

  closeModal() {
    this.isModal = false;
    this.modalAction = undefined;
  }

  moveRight(event: any) {

  }

  moveLeft(event: any) {

  }

}
