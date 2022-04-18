import { Component, OnInit } from '@angular/core';
import { Reservation, ReservationForm, TimeTable } from './intefaces';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';
import { ReservationService } from './reservation.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {

  environment = environment;

  constructor(
    private api: ApiService,
    private DatePipe: DatePipe,
    private reservationService: ReservationService
  ) { }

  timetable: TimeTable[] = [{ label: '00:00' }];
  isModal: boolean = false;
  modalAction: 'new' | 'edit' | undefined = undefined;
  date: string = '';

  players: Player[] = [];
  reservations: Reservation[] = [];

  ceilStep: number = 40;
  hourStep: number = 0.25;
  columnStep: number = 250;

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

  submit(input: ReservationForm) {
    if (this.modalAction === 'new') {
      this.addReservation(input);
    }
    if (this.modalAction === 'edit') {

    }
    this.closeModal();
  }

  addReservation(input: ReservationForm) {
    const { form } = input;
    const transformY: number = this.reservationService.setTransformY(form.timeFrom);
    const transformX: number = this.reservationService.setTransformX(form.court);
    const ceilHeight: number = this.reservationService.setCeilHeight(form.timeFrom, form.timeTo);
    const zIndex: number = this.reservationService.setHighestIndexInColumn(form.court, this.reservations);
    const hourCount: number = this.reservationService.setHourCount(form.timeFrom, form.timeTo);
    const isPayed: boolean = false;

    const newReservation: Reservation = {
      timetable: {
        transformY,
        transformX,
        ceilHeight,
        zIndex
      },
      form: form,
      payment: {
        hourCount
      },
      isPayed
    };
    this.reservations.push(newReservation);

  }



  moveRight(event: any) {

  }

  moveLeft(event: any) {

  }

}
