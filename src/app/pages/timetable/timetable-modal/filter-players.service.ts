import { Injectable } from '@angular/core';
import { Player, Week } from '../../players/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FilterPlayersService {

  constructor() { }

  private timeToNumber(time: string): number {
    return parseFloat(time.replace(':', '.'));
  }

  private checkDay(week: Pick<Week, 'days'>, day: keyof Week['days']): boolean {
    return week.days[day] ? true : false;
  }

  private getDayFromDate(date: string): number {
    let day: number = new Date(date).getDay();
    day -= 1;
    day === -1 ? day = 6 : null;
    return day;
  }

  findPlayers(array: Player[], fromTime: string, toTime: string, dateTime: string): Player[] {
    const day: any = this.getDayFromDate(dateTime);
    const from: number = this.timeToNumber(fromTime);
    const to: number = this.timeToNumber(toTime);
    const players: Player[] = [];
    array.forEach(pl => {
      for (let w of pl.weeks) {
        if (this.checkDay(w, day)) {
          let wFrom: number;
          let wTo: number;
          if (w.time.from == '') {
            wFrom = 0;
          } else {
            wFrom = this.timeToNumber(w.time.from);
          }
          if (w.time.to == '') {
            wTo = 23.59;
          } else {
            wTo = this.timeToNumber(w.time.to);
          }
          if (wFrom <= from || wTo >= to) {
            players.push(pl);
          }
        }
      }
    });
    return players;
  }

  findAllOpponents(playerId: string, array: Player[]) {
    const allOpponents: Player[] = [];
    for (let pl of array) {
      if (pl.id === playerId) {
        for (let op of pl.opponents) {
          const opponent = array.find(el => el.id == op.id);
          opponent ? allOpponents.push(opponent) : null;
        }
      }
    }
    return allOpponents;
  }

  findOpponentOnHour(playerId: string, fromTime: string, toTime: string, dateTime: string, array: Player[]) {
    const day: any = this.getDayFromDate(dateTime);
    const opponents: Player[] = [];
    const allOpponents = this.findAllOpponents(playerId, array);
    const from = this.timeToNumber(fromTime);
    const to = this.timeToNumber(toTime);
    for (let pl of allOpponents) {
      for (let w of pl.weeks) {
        if (this.checkDay(w, day)) {
          let wFrom: number;
          let wTo: number;
          if (w.time.from == '') {
            wFrom = 0;
          } else {
            wFrom = this.timeToNumber(w.time.from);
          }
          if (w.time.to == '') {
            wTo = 23.59;
          } else {
            wTo = this.timeToNumber(w.time.to);
          }
          if (wFrom <= from || wTo >= to) {
            opponents.push(pl);
          }
        }
      }
    }
    return opponents;
  }

}
