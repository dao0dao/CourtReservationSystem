import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Reservation, ReservationForm, TimeTable, ReservationSQL, FormSQL, UpdateReservationSQL } from './intefaces';
import { environment } from 'src/environments/environment';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';
import { ReservationService } from './reservation.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, AfterViewInit {

  environment = environment;
  @ViewChild('board') board!: ElementRef<HTMLElement>;

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

  editedReservation: Reservation | undefined;

  ngOnInit(): void {
    this.date = this.DatePipe.transform(Date.now(), 'YYYY-MM-dd')!;
    this.loadReservations();
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

  ngAfterViewInit(): void {
    const hour = new Date().getHours() - 0.5;
    const div = this.board.nativeElement;
    const scroll = (hour * this.reservationService.ceilHeighHourStep);
    div.scrollTo(0, scroll);
  }

  loadReservations() {
    const regExp = /\d{4}-\d{2}-\d{2}/;
    if (regExp.test(this.date)) {
      this.api.getAllReservations(this.date).subscribe({
        next: (res) => {
          this.reservations = res.reservations;
        }
      });
    }
  }

  reloadReservations() {
    this.reservations = [];
    this.loadReservations();
  }

  newReservation() {
    this.isModal = true;
    this.modalAction = 'new';
  }

  editReservation(res: Reservation) {
    this.isModal = true;
    this.modalAction = 'edit';
    this.editedReservation = res;
  }

  closeModal() {
    this.isModal = false;
    this.modalAction = undefined;
    this.editedReservation = undefined;
  }

  submit(input: ReservationForm) {
    const { form } = input;
    const { date, timeFrom, timeTo, court, playerOne, playerTwo, guestOne, guestTwo } = form;
    const formSQL: FormSQL = {
      date,
      timeFrom,
      timeTo,
      court,
      playerOneId: playerOne?.id!,
      playerTwoId: playerTwo?.id!,
      guestOne,
      guestTwo
    };
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
    const newReservationSQL: ReservationSQL = {
      timetable: {
        transformY,
        transformX,
        ceilHeight,
        zIndex
      },
      form: formSQL,
      payment: {
        hourCount
      },
      isPayed
    };
    if (this.modalAction === 'new') {
      this.addReservation(newReservationSQL, newReservation);
    }
    if (this.modalAction === 'edit') {
      newReservationSQL.id = this.editedReservation!.id;
      newReservation.id = this.editedReservation!.id;
      if (this.editedReservation?.form.date !== newReservation.form.date) {
        const oldReservationId = this.editedReservation!.id!;
        this.changedReservationDate(newReservationSQL, oldReservationId);
      } else {
        this.updateReservation(newReservationSQL, newReservation);
      }
    }
  }

  addReservation(newReservationSQL: ReservationSQL, newReservation: Reservation, addToTimetable: boolean = true) {
    this.api.addReservation(newReservationSQL).subscribe({
      next: (res) => {
        newReservation.id = res.id;
        if (addToTimetable) {
          this.reservations.push(newReservation);
        }
        this.closeModal();
      },
      error: (err) => {
        this.closeModal();
      }
    });
  }

  updateReservation(updatedReservationSQL: ReservationSQL, updatedReservation: Reservation) {
    this.api.updateReservation(updatedReservationSQL).subscribe({
      next: () => {
        this.reservations.forEach(r => {
          if (r.id === this.editedReservation?.id) {
            r.timetable = updatedReservation.timetable;
            r.form = updatedReservation.form;
            r.isPayed = updatedReservation.isPayed;
          }
        });
        this.closeModal();
      },
      error: () => {
        this.closeModal();
      }
    });
  }

  changedReservationDate(newReservationSQL: ReservationSQL, id: string) {
    this.api.addReservation(newReservationSQL).pipe(
      mergeMap(() => this.api.deleteReservation(id))
    ).subscribe({
      next: () => {
        const index = this.reservations.findIndex(r => r.id === id);
        this.reservations.splice(index, 1);
        this.closeModal();
      },
      error: () => {
        this.closeModal();
      }
    });
  }

  moveLeft(res: Reservation) {
    if (res.form.court !== '1') {
      let court: number = parseFloat(res.form.court);
      court -= 1;
      const translateX = this.reservationService.setTransformX(court.toString());
      const zIndex = this.reservationService.setHighestIndexInColumn(court.toString(), this.reservations, res.id!);
      const updatedRes: UpdateReservationSQL = {
        id: res.id,
        form: {
          date: res.form.date,
          court: court.toString()
        },
        timetable: {
          transformX: translateX,
          zIndex: zIndex
        }
      };
      this.api.updateReservation(updatedRes).subscribe({
        next: () => {
          res.timetable.transformX = translateX;
          res.form.court = court.toString();
          res.timetable.zIndex = zIndex;
        }
      });
    }
  }

  moveRight(res: Reservation) {
    if (res.form.court !== '3') {
      let court: number = parseFloat(res.form.court);
      court += 1;
      const translateX = this.reservationService.setTransformX(court.toString());
      const zIndex = this.reservationService.setHighestIndexInColumn(court.toString(), this.reservations, res.id!);
      const updatedRes: UpdateReservationSQL = {
        id: res.id,
        form: {
          date: res.form.date,
          court: court.toString()
        },
        timetable: {
          transformX: translateX,
          zIndex: zIndex
        }
      };
      this.api.updateReservation(updatedRes).subscribe({
        next: () => {
          res.timetable.transformX = translateX;
          res.form.court = court.toString();
          res.timetable.zIndex = zIndex;
        }
      });
    }
  }

  moveDown(res: Reservation) {
    if (res.timetable.zIndex > 1) {
      const zIndex = res.timetable.zIndex - 1;
      const updatedRes = {
        id: res.id,
        form: { date: res.form.date },
        timetable: { zIndex }
      };
      this.api.updateReservation(updatedRes).subscribe({
        next: () => {
          res.timetable.zIndex = zIndex;
        }
      });
    }
  }

  moveOnTop(res: Reservation) {
    const zIndex = this.reservationService.setHighestIndexInColumn(res.form.court, this.reservations, res.id!);
    res.timetable.zIndex = zIndex;
  }

  dragEnd(res: Reservation, event: CdkDragEnd, el: HTMLElement) {
    const zIndex: number = this.reservationService.setHighestIndexInColumn(res.form.court, this.reservations, res.id!);
    const translateY = (Math.floor(event.distance.y / this.reservationService.ceilStep)) * this.reservationService.ceilStep;
    let transformY = res.timetable.transformY + translateY;
    //Ograniczenie od góry
    if (transformY < 0) {
      transformY = 0;
    }
    //Ograniczenie od dołu
    if (transformY > this.reservationService.lastCeilStep) {
      transformY = this.reservationService.lastCeilStep;
    }

    const time = this.reservationService.setTimeFromTransformY(transformY, res.payment.hourCount);

    const updatedRes: UpdateReservationSQL = {
      id: res.id,
      timetable: {
        ceilHeight: time.ceilHeight,
        transformY
      },
      form: {
        date: res.form.date,
        timeFrom: time.timeStart,
        timeTo: time.timeEnd
      },
      payment: {
        hourCount: time.hourCount
      }
    };
    this.api.updateReservation(updatedRes).subscribe({
      next: () => {
        res.timetable.ceilHeight = time.ceilHeight;
        res.timetable.transformY = transformY;
        res.form.timeFrom = time.timeStart;
        res.form.timeTo = time.timeEnd;
        res.payment.hourCount = time.hourCount;
        el.style.transform = '';
        event.source._dragRef.reset();
      },
      error: () => {
        event.source._dragRef.reset();
      }
    });
  }

}
