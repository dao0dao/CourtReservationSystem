import { Component, OnInit } from '@angular/core';
import { Week } from '../interfaces';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {

  weeks: Week[] = [];

  constructor() { }

  setWeeks(event: Week[]) {
    this.weeks = event;
    console.log(this.weeks);
  }

  ngOnInit(): void {
  }

}
