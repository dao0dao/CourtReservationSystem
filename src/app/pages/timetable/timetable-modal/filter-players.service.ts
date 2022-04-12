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

  findPlayerById(id: string, arr: Player[]): string {
    let string = '';
    const player = arr.find(pl => pl.id === id);
    if (player) {
      string = player.surname + ' ' + player.name;
    }
    return string;
  }

  reduceList(input: string, array: Player[]): Player[] {
    if (!input) {
      return array;
    }
    const value = input.toLocaleLowerCase().split(' ');
    const players: Player[] = [];
    array.forEach(p => {
      const { name, surname, telephone, email, priceSummer, priceWinter, court, stringsName, balls, notes } = p;
      let matches: number = 0;
      for (let i = 0; i < value.length; i++) {
        const word = value[i].toLocaleLowerCase();
        if (
          name.toLocaleLowerCase().startsWith(word) ||
          surname.toLocaleLowerCase().startsWith(word) ||
          telephone?.toString().startsWith(word) ||
          email?.toLocaleLowerCase().startsWith(word) ||
          stringsName?.toLocaleLowerCase().startsWith(word) ||
          balls?.toLocaleLowerCase().startsWith(word)
          // || notes?.toLocaleLowerCase().includes(word)
          // || priceSummer?.toString().includes(word) ||
          // priceWinter?.toString().includes(word) 
        ) {
          matches += 1;
        }
        if ('niebieski'.startsWith(word) && court == 1) {
          matches += 1;
        }
        if ('fioletowy'.startsWith(word) && court == 2) {
          matches += 1;
        }
        if (notes) {
          const notesWords = notes.toLocaleLowerCase().split(' ');
          for (let note of notesWords) {
            if (note.startsWith(word)) {
              matches += 1;
            }
          }
        }
      }
      if (matches >= value.length) {

        players.push(p);
      }
    });
    return players;
  }

}
