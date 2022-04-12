import { Injectable } from '@angular/core';
import { Player } from '../../players/interfaces';

interface Click {

}

@Injectable({
  providedIn: 'root'
})
export class HandleSelectService {

  constructor() { }

  isOneOpen: boolean = false;
  isTwoOpen: boolean = false;

  indexOne: undefined | number;
  indexTwo: undefined | number;

  toggleClick(event: any) {
    const listOne = event.target.closest('#listOne');
    const listTwo = event.target.closest('#listOne');
    if (listOne && !this.isOneOpen) {
      this.isOneOpen = true;
    } else {
      this.isOneOpen = false;
    }
    if (listTwo && !this.isTwoOpen) {
      this.isTwoOpen = true;
    } else {
      this.isTwoOpen = false;
    }
  }

  mouseEnter(event: any | { target: HTMLElement; }) {
    this.indexOne = undefined;
    this.indexTwo = undefined;
    event.target.classList.add('list_element--active');
  }

  mouseLeave(event: any | { target: HTMLElement; }) {
    event.target.classList.remove('list_element--active');
  }


  keyDown(event: KeyboardEvent, select: 'one' | 'two', length: number) {
    if (event.key != 'Enter') {
      select === 'one' ? this.isOneOpen = true : null;
      select === 'two' ? this.isTwoOpen = true : null;
    }
    if (event.key == 'ArrowDown') {
      return this.moveDown(select, length);
    }
    if (event.key == 'ArrowUp') {
      return this.moveUp(select, length);
    }
  }

  moveDown(event: 'one' | 'two', length: number) {
    if (event === 'one') {
      if (this.indexOne === undefined) {
        this.indexOne = 0;
      } else {
        this.indexOne >= length ? null : this.indexOne += 1;
      }
    }
    if (event === 'two') {
      if (this.indexTwo === undefined) {
        this.indexTwo = 0;
      } else {
        this.indexTwo >= length ? null : this.indexTwo += 1;
      }
    }
  }

  moveUp(event: 'one' | 'two', length: number) {
    if (event === 'one') {
      if (this.indexOne) {
        this.indexOne === 0 ? this.indexOne = undefined : this.indexOne -= 1;
      }
    }
    if (event === 'two') {
      if (this.indexTwo) {
        this.indexTwo === 0 ? this.indexTwo = undefined : this.indexTwo -= 1;
      }
    }
  }

  keyEnter(players: Player[]): Player | undefined {
    const player = players.find((pl, index) => (index + 1) === this.indexOne);
    this.indexOne = undefined;
    this.indexTwo = undefined;
    this.isOneOpen = false;
    this.isTwoOpen = false;
    return player;
  }

}
