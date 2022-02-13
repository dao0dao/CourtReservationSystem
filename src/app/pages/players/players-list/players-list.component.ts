import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AddPlayerError, Opponent, OpponentSql, Player, PlayerSql, Week } from '../interfaces';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent implements OnInit, OnChanges {
  environment = environment;

  constructor(private fb: FormBuilder) { }

  @Input() players: Player[] = [];
  @Input() allOpponents: Opponent[] = [];

  filteredOpponents: Opponent[] = [];
  filteredChosenOpponents: Opponent[] = [];
  editedWeeks: Week[] = [];

  updatedWeeks: Week[] = [];
  updatedOpponents: OpponentSql[] = [];

  filteredPlayers: Player[] = [];
  editOpponents: Opponent[] | undefined;
  changeStatus: boolean = false;
  errors: AddPlayerError = {};
  isPopUp: boolean = false;

  formEditPlayer: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.formEditPlayer = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.email]],
      priceSummer: [0, [Validators.min(0), Validators.max(1000)]],
      priceWinter: [0, [Validators.min(0), Validators.max(1000)]],
      court: [0],
      strings: ['', Validators.maxLength(20)],
      tension: [25, [Validators.min(15), Validators.max(35)]],
      balls: ['', Validators.maxLength(20)],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players'].currentValue != changes['players'].previousValue) {
      this.filteredPlayers = [...this.players];
    }
  }

  getField(name: string): AbstractControl | null {
    return this.formEditPlayer.get(name);
  }

  resetForm() {
    this.formEditPlayer.reset();
    this.changeStatus = !this.changeStatus;
    this.getField('id')?.setValue('');
    this.getField('priceSummer')?.setValue(0);
    this.getField('priceWinter')?.setValue(0);
    this.getField('court')?.setValue(0);
    this.getField('tension')?.setValue(25);
    this.formEditPlayer.updateValueAndValidity();
    this.filteredOpponents = [];
    this.filteredChosenOpponents = [];
    this.editedWeeks = [];
    this.updatedOpponents = [];
    this.updatedWeeks = [];
  }

  setWeeks(event: Week[]) {
    this.updatedWeeks = event;
  }

  setOpponents(event: OpponentSql[]) {
    this.updatedOpponents = event;
  }

  openPopUp(index: number) {
    const player = this.filteredPlayers[index];
    this.editedWeeks = player.weeks;
    this.isPopUp = true;
    this.filterOpponents(player.opponents, player.id!);
    this.getField('id')?.setValue(player.id);
    this.getField('name')?.setValue(player.name);
    this.getField('surname')?.setValue(player.surname);
    this.getField('telephone')?.setValue(player.telephone);
    this.getField('email')?.setValue(player.email);
    this.getField('priceSummer')?.setValue(player.priceSummer);
    this.getField('priceWinter')?.setValue(player.priceWinter);
    this.getField('court')?.setValue(player.court);
    this.getField('strings')?.setValue(player.stringsName);
    this.getField('tensions')?.setValue(player.tension);
    this.getField('balls')?.setValue(player.balls);
    this.getField('notes')?.setValue(player.notes);
    this.formEditPlayer.updateValueAndValidity();
  }
  closePopUp() {
    this.isPopUp = false;
    this.resetForm();
  }

  filterOpponents(opponents: Opponent[], playerId: string) {
    let filteredOpponents = [...this.allOpponents];
    filteredOpponents = filteredOpponents.filter(op => op.id != playerId);
    opponents.forEach(op => {
      filteredOpponents = filteredOpponents.filter(el => el.id != op.id);
    });
    this.filteredOpponents = filteredOpponents;
    this.filteredChosenOpponents = opponents;
  }

  submit() {
    const { id, name, surname, telephone, email, account, priceSummer, priceWinter, court, strings, tension, balls, notes } = this.formEditPlayer.value;
    const player: PlayerSql = {
      weeks: this.updatedWeeks,
      opponents: this.updatedOpponents,
      id, name, surname, telephone, email, account, priceSummer, priceWinter, court, stringsName: strings, tension, balls, notes
    };
    console.log(player);
  }

}
