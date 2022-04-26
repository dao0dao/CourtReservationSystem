import { Injectable } from '@angular/core';
import { Reservation } from './intefaces';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor() { }

  public ceilStep: number = 40;
  private maxSteps: number = (24 * 4) - 2;
  public lastCeilStep: number = this.maxSteps * this.ceilStep;
  private ceilStartStep: number = 0.25;
  private columnStartStep: number = 250;
  public ceilHeighHourStep: number = 160;


  private timeToDecimals(time: string) {
    const hour: number = parseFloat(time.slice(0, 2));
    let minutes: number = parseFloat(time.slice(3, 5));
    switch (minutes) {
      case 15:
        minutes = 0.25;
        break;
      case 30:
        minutes = 0.5;
        break;
      case 45:
        minutes = 0.75;
        break;
      default:
        minutes = 0;
        break;
    }
    return (hour + minutes);
  }

  setTransformY(fromTime: string): number {
    const time: number = this.timeToDecimals(fromTime);
    return this.ceilStep * (time / this.ceilStartStep);
  }

  setTransformX(court: string) {
    const number: number = parseFloat(court) - 1;
    return this.columnStartStep * number;
  }

  setHourCount(fromTime: string, toTime: string): number {
    const start = this.timeToDecimals(fromTime);
    let end = this.timeToDecimals(toTime);
    if (end <= start) {
      end = 24;
    }
    const hourCount: number = end - start;
    return hourCount;
  }

  setCeilHeight(fromTime: string, toTime: string) {
    const height: number = this.setHourCount(fromTime, toTime) * this.ceilHeighHourStep;
    return height;
  }

  setHighestIndexInColumn(court: string, reservation: Reservation[], elId: string = ''): number {
    let zIndex = 10;
    reservation.forEach(r => {
      if (r.form.court === court && r.timetable.zIndex >= zIndex && r.id !== elId) {
        zIndex = r.timetable.zIndex + 1;
      }
    });
    return zIndex;
  }

  private timeToString(time: number) {
    const hourNumber: number = Math.floor(time);
    let hour = '';
    let minutes = '';
    if (hourNumber < 10) {
      hour = '0' + hourNumber;
    } else {
      hour = hourNumber.toString();
    }
    const timeArr = time.toString().split('.');
    if (timeArr.length === 2) {
      const min = timeArr[1];
      switch (min) {
        case '25':
          minutes = '15';
          break;
        case '5':
          minutes = '30';
          break;
        case '75':
          minutes = '45';
          break;
        default:
          minutes = '00';
          break;
      }
    } else {
      minutes = '00';
    }
    return (hour + ':' + minutes);
  }

  setTimeFromTransformY(transformY: number, hourCount: number): { timeStart: string, timeEnd: string, hourCount: number; ceilHeight: number; } {
    const timeStartNumber = (transformY / this.ceilStep) * this.ceilStartStep;
    let timeEndNumber = timeStartNumber + hourCount;
    const timeStart = this.timeToString(timeStartNumber);
    let newHourCount = hourCount;
    if (timeEndNumber >= 24) {
      timeEndNumber > 24 ? newHourCount = timeEndNumber - 24 : null;
      timeEndNumber -= 24;
    }
    const timeEnd = this.timeToString(timeEndNumber);
    const ceilHeight = this.setCeilHeight(timeStart, timeEnd);
    return { timeStart, timeEnd, hourCount: newHourCount, ceilHeight };
  }

}
