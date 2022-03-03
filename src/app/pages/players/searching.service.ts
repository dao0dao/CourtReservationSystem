import { Injectable } from '@angular/core';
import { Player } from './interfaces';

@Injectable()
export class SearchingService {

  constructor() { }

  searchFor(input: string, array: Player[]): Player[] {
    if (!input) {
      return array;
    }
    const value = input.toLocaleLowerCase().split(' ');
    const players: Player[] = [];
    array.forEach(p => {
      const { weeks, opponents, name, surname, telephone, email, priceSummer, priceWinter, court, stringsName, tension, balls, notes } = p;
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
          // priceWinter?.toString().includes(word) ||
          // tension?.toString().includes(word)
        ) {
          matches += 1;
        }
        if (word === 'niebieski' && court === 1) {
          matches += 1;
        }
        if (word === 'fioletowy' && court === 2) {
          matches += 1;
        }
        if (
          word.includes('poniedziałek') ||
          word.includes('wtorek') ||
          word.includes('środa') ||
          word.includes('czwartek') ||
          word.includes('piątek') ||
          word.includes('sobota') ||
          word.includes('niedziela') ||
          word.includes('pn') ||
          word.includes('wt') ||
          word.includes('śr') ||
          word.includes('cz') ||
          word.includes('pt') ||
          word.includes('sb') ||
          word.includes('nd')
        ) {

        }
      }
      if (matches >= value.length) {
        players.push(p);
      }
    });
    return players;
  }

}
