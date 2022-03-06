import { Injectable } from '@angular/core';
import { Player, Week } from './interfaces';

@Injectable()
export class SearchingService {

  constructor() { }

  searchFor(input: string, searchWeek: Week, array: Player[]): Player[] {
    if (!input && !Object.keys(searchWeek.days).length) {
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
          name.toLocaleLowerCase().includes(word) ||
          surname.toLocaleLowerCase().includes(word) ||
          telephone?.toString().includes(word) ||
          email?.toLocaleLowerCase().includes(word) ||
          stringsName?.toLocaleLowerCase().includes(word) ||
          balls?.toLocaleLowerCase().includes(word) ||
          notes?.toLocaleLowerCase().includes(word)
          // || priceSummer?.toString().includes(word) ||
          // priceWinter?.toString().includes(word) 
        ) {
          matches += 1;
        }
        if ('niebieski'.includes(word) && court == 1) {
          matches += 1;
        }
        if ('fioletowy'.includes(word) && court == 2) {
          matches += 1;
        }
      }
      if (matches >= value.length) {
        players.push(p);
      }
    });
    this.searchForDay(searchWeek, players);
    return players;
  }

  private searchForDay(searchWeek: Week, arr: Player[]): Player[] {
    const players: Player[] = [];
    arr.forEach(p => {
      for (let week of p.weeks) {
        if (
          ((week.days[0] == searchWeek.days[0] && week.days[0] == true) ||
            (week.days[1] == searchWeek.days[1] && week.days[1] == true) ||
            (week.days[2] == searchWeek.days[2] && week.days[2] == true) ||
            (week.days[3] == searchWeek.days[3] && week.days[3] == true) ||
            (week.days[4] == searchWeek.days[4] && week.days[4] == true) ||
            (week.days[5] == searchWeek.days[5] && week.days[5] == true) ||
            (week.days[6] == searchWeek.days[6] && week.days[6] == true)) && (!searchWeek.time.from && !searchWeek.time.to)
        ) {
          players.push(p);
        } else if (
          ((week.days[0] == searchWeek.days[0] && week.days[0] == true) ||
            (week.days[1] == searchWeek.days[1] && week.days[1] == true) ||
            (week.days[2] == searchWeek.days[2] && week.days[2] == true) ||
            (week.days[3] == searchWeek.days[3] && week.days[3] == true) ||
            (week.days[4] == searchWeek.days[4] && week.days[4] == true) ||
            (week.days[5] == searchWeek.days[5] && week.days[5] == true) ||
            (week.days[6] == searchWeek.days[6] && week.days[6] == true)) && (searchWeek.time.from && !searchWeek.time.to)
        ) {
          const from = parseFloat(week.time.from.replace(':', '.'));
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          if (from >= searchFrom) {
            players.push(p);
          }
        } else if (
          ((week.days[0] == searchWeek.days[0] && week.days[0] == true) ||
            (week.days[1] == searchWeek.days[1] && week.days[1] == true) ||
            (week.days[2] == searchWeek.days[2] && week.days[2] == true) ||
            (week.days[3] == searchWeek.days[3] && week.days[3] == true) ||
            (week.days[4] == searchWeek.days[4] && week.days[4] == true) ||
            (week.days[5] == searchWeek.days[5] && week.days[5] == true) ||
            (week.days[6] == searchWeek.days[6] && week.days[6] == true)) && (!searchWeek.time.from && searchWeek.time.to)
        ) {
          const to = parseFloat(week.time.to.replace(':', '.'));
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          if (to <= searchTo) {
            players.push(p);
          }
        } else if (
          ((week.days[0] == searchWeek.days[0] && week.days[0] == true) ||
            (week.days[1] == searchWeek.days[1] && week.days[1] == true) ||
            (week.days[2] == searchWeek.days[2] && week.days[2] == true) ||
            (week.days[3] == searchWeek.days[3] && week.days[3] == true) ||
            (week.days[4] == searchWeek.days[4] && week.days[4] == true) ||
            (week.days[5] == searchWeek.days[5] && week.days[5] == true) ||
            (week.days[6] == searchWeek.days[6] && week.days[6] == true)) && (searchWeek.time.from && searchWeek.time.to)
        ) {
          const from = parseFloat(week.time.from.replace(':', '.'));
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          const to = parseFloat(week.time.to.replace(':', '.'));
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          if (from >= searchFrom && to <= searchTo) {
            players.push(p);
          }
        }
      }
    });
    console.log(players);
    return players;
  }
}
