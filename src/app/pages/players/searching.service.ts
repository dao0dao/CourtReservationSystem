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

  private checkDayMatch(day: any, searchDay: any, key: any): number {
    if (day[key] === searchDay[key]) {
      return 1;
    }
    return 0;
  }

  private searchForDay(searchWeek: Week, arr: Player[]): Player[] {
    const players: Player[] = [];
    arr.forEach(p => {
      for (let week of p.weeks) {
        if (!searchWeek.time.from && !searchWeek.time.to) {
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (matches === keys.length) {
            players.push(p);
          }
        } else if (searchWeek.time.from && !searchWeek.time.to) {
          let from: string | number = week.time.from;
          if (from) {
            from = parseFloat(from.replace(':', '.'));
          }
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (from >= searchFrom && matches === keys.length) {
            players.push(p);
          }
        } else if (!searchWeek.time.from && searchWeek.time.to) {
          let to: number | string = week.time.to;
          if (to) {
            to = parseFloat(to.replace(':', '.'));
          }
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (to <= searchTo && matches === keys.length) {
            players.push(p);
          }
        } else if (searchWeek.time.from && searchWeek.time.to) {
          let from: string | number = week.time.from;
          if (from) {
            from = parseFloat(from.replace(':', '.'));
          }
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          let to: number | string = week.time.to;
          if (to) {
            to = parseFloat(to.replace(':', '.'));
          }
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if ((from >= searchFrom && to <= searchTo) && matches === keys.length) {
            players.push(p);
          }
        }
      }
    });
    console.log(players);
    return players;
  }
}
