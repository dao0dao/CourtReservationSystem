import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Player } from '../../players/interfaces';
import { HourPriceNumber, PriceList, PriceListNumber } from '../../price-list/interfaces';
import { Method, PlayerPayment, Reservation, ReservationPayment } from '../interfaces';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent implements OnInit {

  environment = environment;
  @Input() reservation: Reservation | undefined;
  @Input() priceLists: PriceList[] = [];
  @Input() players: Player[] = [];
  priceListsNumbers: PriceListNumber[] = [];
  @Output() CloseModal: EventEmitter<undefined> = new EventEmitter();
  @Output() PayForReservation: EventEmitter<ReservationPayment> = new EventEmitter();

  constructor() { }

  isSubmitting: boolean = false;

  timeFrom: string = '';
  timeTo: string = '';

  court: string = '';

  playerOne: string = '';
  playerTwo: string = '';

  paymentOne: number | undefined;
  paymentTwo: number | undefined;

  methodOne: Method = 'cash';
  methodTwo: Method = 'cash';

  ngOnInit(): void {
    this.timeFrom = this.reservation?.form?.timeFrom!;
    this.timeTo = this.reservation?.form.timeTo!;
    this.setPriceListsNumbers();
    this.setCourt();
    this.setPlayers();
    this.setPayment();
  }

  private timeToNumber(time: string): number {
    const timeArr = time.split(':');
    const hour: number = parseFloat(timeArr[0]);
    let minutes: number = 0;
    switch (timeArr[1]) {
      case '15':
        minutes = 0.25;
        break;
      case '30':
        minutes = 0.5;
        break;
      case '45':
        minutes = 0.75;
        break;
    }
    return hour + minutes;
  }

  setPriceListsNumbers() {
    this.priceLists.forEach(list => {
      const id = list.id;
      const name = list.name;
      const hours: { [key: string]: HourPriceNumber; } = {};
      for (let i in list.hours) {
        const hr = list.hours[i];
        const from = this.timeToNumber(hr.from);
        let to = this.timeToNumber(hr.to);
        if (to === 0) {
          to = 24;
        }
        const numberHr: HourPriceNumber = {
          from: from,
          to: to,
          price: hr.price
        };
        hours[i] = numberHr;
      }
      this.priceListsNumbers.push({ id, name, hours });
    });
  }

  setCourt() {
    switch (this.reservation?.form.court) {
      case '1':
        this.court = 'Niebieski';
        break;
      case '2':
        this.court = 'Fioletowy';
        break;
    }
  }

  setPlayers() {
    if (this.reservation?.form.playerOne && !this.reservation.isPlayerOnePayed) {
      this.playerOne = this.reservation.form.playerOne.name + ' ' + this.reservation.form.playerOne.surname;
    } else if (this.reservation?.form.guestOne && !this.reservation.isPlayerOnePayed) {
      this.playerOne = this.reservation?.form.guestOne;
    };
    if (this.reservation?.form.playerTwo && !this.reservation.isPlayerTwoPayed) {
      this.playerTwo = this.reservation.form.playerTwo.name + ' ' + this.reservation.form.playerTwo.surname;
    } else if (this.reservation?.form.guestTwo && !this.reservation.isPlayerTwoPayed) {
      this.playerTwo = this.reservation?.form.guestTwo;
    };
  }

  setPayment() {
    const resTimeFrom = this.timeToNumber(this.reservation?.form.timeFrom!);
    let resTimeTo = this.timeToNumber(this.reservation?.form.timeTo!);
    const hourCount = this.reservation?.payment.hourCount;
    if (resTimeTo === 0) { resTimeTo = 24; }
    if (this.reservation?.form.playerOne && hourCount) {
      const player = this.players.find(pl => pl.id == this.reservation?.form.playerOne?.id);
      const list = this.priceListsNumbers.find(list => list.id === player?.priceListId);
      if (list) {
        let price = this.setPrice(resTimeFrom, resTimeTo, hourCount, list);
        this.paymentOne = this.playerTwo ? price / 2 : price;
      }
    }
    if (this.reservation?.form.playerTwo && hourCount) {
      const player = this.players.find(pl => pl.id == this.reservation?.form.playerTwo?.id);
      const list = this.priceListsNumbers.find(list => list.id === player?.priceListId);
      if (list) {
        let price = this.setPrice(resTimeFrom, resTimeTo, hourCount, list);
        this.paymentTwo = this.playerOne ? price / 2 : price;
      }
    }
  }

  setPrice(resTimeFrom: number, resTimeTo: number, hourCount: number, list: PriceListNumber): number {
    let listArr: HourPriceNumber[] = [];
    let price: number = 0;
    for (let i in list.hours) {
      listArr.push(list.hours[i]);
    }
    listArr = listArr.filter(list => resTimeFrom < list.to && resTimeTo > list.from);
    let timeFrom = resTimeFrom;
    let leftTime = hourCount;
    for (let h of listArr) {
      const playedTime = (h.to - timeFrom) > leftTime ? leftTime : (h.to - timeFrom);
      price = price + (playedTime * h.price);
      leftTime = leftTime - playedTime;
    }
    price = parseFloat(price.toFixed(2));
    return price;
  }

  checkValue(key: 'one' | 'two') {
    if (key === 'one') {
      this.paymentOne === null ? this.paymentOne = undefined : this.paymentOne = parseFloat(this.paymentOne?.toFixed(2)!);
    }
    if (key === 'two') {
      this.paymentTwo === null ? this.paymentTwo = undefined : this.paymentTwo = parseFloat(this.paymentTwo?.toFixed(2)!);
    }
  }

  closeModal() {
    this.CloseModal.emit();
  }

  payForReservation() {
    this.isSubmitting = true;
    const plOne = this.reservation?.form.playerOne;
    const plTwo = this.reservation?.form.playerTwo;
    const payment: ReservationPayment = {
      reservationId: this.reservation?.id!,
      playerOne: {
        id: plOne?.id,
        name: this.playerOne,
        method: this.methodOne,
        value: this.paymentOne!,
        serviceName: 'Gra - ' + this.reservation?.payment.hourCount + 'godz.'
      },
      playerTwo: {
        id: plTwo?.id,
        name: this.playerTwo,
        method: this.methodTwo,
        value: this.paymentTwo!,
        serviceName: 'Gra - ' + this.reservation?.payment.hourCount + 'godz.'
      }
    };
    this.PayForReservation.emit(payment);
  }

}
