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

  findPlayers(array: Player[], fromTime: string, toTime: string, dateTime: string): Player[] {
    let day: any = new Date(dateTime).getDay();
    day -= 1;
    day === -1 ? day = 6 : null;
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
            wTo = 0;
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
    array.forEach(pl => {
      for (let op of pl.opponents) {
        if (op.id === playerId) {
          allOpponents.push(pl);
        }
      }
    });
    return allOpponents;
  }

}
