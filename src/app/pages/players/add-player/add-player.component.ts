import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Opponent, Week } from '../interfaces';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {

  weeks: Week[] = [];
  opponents: Opponent[] = [];

  formAddPlayer: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  setWeeks(event: Week[]) {
    this.weeks = event;
  }

  setOpponents(event: Opponent[]) {
    this.opponents = event;
  }

  ngOnInit(): void {
    
  }

}
