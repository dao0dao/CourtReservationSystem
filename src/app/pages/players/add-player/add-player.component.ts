import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { AddPlayer, AddPlayerError, Opponent, Week } from '../interfaces';
import { ApiService } from './api.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {

  weeks: Week[] = [];
  opponents: Opponent[] = [];

  isSending: boolean = false;
  changeStatus: boolean = false;

  formAddPlayer: FormGroup = new FormGroup({});
  errors: AddPlayerError = {};

  constructor(private fb: FormBuilder, private api: ApiService, private infoService: InfoService) { }

  setWeeks(event: Week[]) {
    this.weeks = event;
  }

  setOpponents(event: Opponent[]) {
    this.opponents = event;
  }

  getField(name: string) {
    return this.formAddPlayer.get(name);
  }

  resetForm() {
    this.formAddPlayer.reset();
    this.getField('account')?.setValue(0);
    this.getField('priceSummer')?.setValue(0);
    this.getField('priceWinter')?.setValue(0);
    this.getField('tension')?.setValue(25);
    this.formAddPlayer.updateValueAndValidity();
    this.changeStatus = !this.changeStatus;
  }

  submit() {
    this.isSending = true;
    const { name, surname, telephone, email, account, priceSummer, priceWinter, court, strings, tension, balls, notes } = this.formAddPlayer.value;
    const player: AddPlayer = {
      weeks: this.weeks,
      opponents: this.opponents,
      name, surname, telephone, email, account, priceSummer, priceWinter, court, strings, tension, balls, notes
    };
    this.api.addPlayer(player).subscribe({
      next: () => {
        this.resetForm();
        this.isSending = false;
      },
      error: (err: { error: AddPlayerError | string; }) => {
        console.log(err);
        if (typeof (err.error) === 'string') {
          this.infoService.showInfo(`Gracz ${this.getField('name')?.value} ${this.getField('surname')?.value} już istnieje`);
        } else {
          this.errors = err.error;
        }
        this.isSending = false;
      }
    });
  }

  ngOnInit(): void {
    this.formAddPlayer = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.email]],
      account: [0, [Validators.required, Validators.min(0)]],
      priceSummer: [0, [Validators.min(0), Validators.max(1000)]],
      priceWinter: [0, [Validators.min(0), Validators.max(1000)]],
      court: [''],
      strings: ['', Validators.maxLength(20)],
      tension: [25, [Validators.min(15), Validators.max(35)]],
      balls: ['', Validators.maxLength(20)],
      notes: ['', Validators.maxLength(500)]
    });
  }

}
