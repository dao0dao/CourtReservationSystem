import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddPlayer, Opponent, Week } from '../interfaces';

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

  getField(name: string) {
    return this.formAddPlayer.get(name);
  }

  submit() {
    const { name, surname, telephone, email, account, price, court, strings, tension, balls, notes } = this.formAddPlayer.value;
    const player: AddPlayer = {
      weeks: this.weeks,
      opponents: this.opponents,
      name, surname, telephone, email, account, price, court, strings, tension, balls, notes
    };

  }

  ngOnInit(): void {
    this.formAddPlayer = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.email]],
      account: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.min(0), Validators.max(1000)]],
      court: [''],
      strings: ['', Validators.maxLength(20)],
      tension: [25, [Validators.min(15), Validators.max(35)]],
      balls: ['', Validators.maxLength(20)],
      notes: ['', Validators.maxLength(500)]
    });
  }

}
