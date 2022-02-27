import { Injectable } from '@angular/core';
import { Player } from './interfaces';

@Injectable()
export class SearchingService {

  constructor() { }

  searchFor(value: string, array: Player[]): Player[] {
    if (!value) {
      return array;
    }
    let players = [...array];
    return players;
  }

}
