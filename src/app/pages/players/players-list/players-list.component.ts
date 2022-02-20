import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { EditPlayerError, Opponent, OpponentSql, Player, PlayerSql, Week } from '../interfaces';
import { LoginStateService } from '../../login-state.service';
import { animations } from './animations';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
  animations: animations
})
export class PlayersListComponent implements OnInit, OnChanges, DoCheck {
  environment = environment;

  constructor(private fb: FormBuilder, private api: ApiService, private infoService: InfoService, private loginStateService: LoginStateService) { }

  @Input() players: Player[] = [];
  @Input() allOpponents: Opponent[] = [];
  @Output() outputUpdateUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  isAdmin: boolean = false;

  filteredOpponents: Opponent[] = [];
  filteredChosenOpponents: Opponent[] = [];
  editedWeeks: Week[] = [];

  updatedWeeks: Week[] = [];
  updatedOpponents: OpponentSql[] = [];

  filteredPlayers: Player[] = [];
  editOpponents: Opponent[] | undefined;
  changeStatus: boolean = false;
  errors: EditPlayerError = {};
  isPopUp: boolean = false;

  formEditPlayer: FormGroup = new FormGroup({});

  isSending: boolean = false;

  isDeletePopUp: boolean = false;
  deletingPlayerId: string = '';
  isSendingDelete: boolean = false;

  isView: boolean = false;

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

  ngDoCheck(): void {
    if (this.loginStateService.state.isAdmin === true && this.isAdmin === false) {
      this.isAdmin = true;
    }
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
    this.isView = false;
    this.isPopUp = false;
    this.resetForm();
  }

  openView(index: number) {
    this.isView = true;
    this.openPopUp(index);
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
    this.isSending = true;
    const { id, name, surname, telephone, email, account, priceSummer, priceWinter, court, strings, tension, balls, notes } = this.formEditPlayer.value;
    const player: PlayerSql = {
      weeks: this.updatedWeeks,
      opponents: this.updatedOpponents,
      id, name, surname, telephone, email, account, priceSummer, priceWinter, court, stringsName: strings, tension, balls, notes
    };
    this.api.updatePlayer(player).subscribe({
      next: () => {
        this.closePopUp();
        this.outputUpdateUser.emit(true);
        this.isSending = false;
        this.errors = {};
      },
      error: (data: { error: EditPlayerError; }) => {
        const err = data.error;
        if (err.id || err.nonExistPlayer) {
          this.closePopUp();
          this.outputUpdateUser.emit(true);
          this.infoService.showInfo('Taki gracz nie istnieje');
        } else if (err.alreadyExist) {
          this.infoService.showInfo(`Gracz ${name} ${surname} już istnieje!`);
        } else {
          this.errors = err;
        }
        this.isSending = false;
      }
    });
  }

  openDeletePopUp(index: number) {
    this.deletingPlayerId = this.filteredPlayers[index].id!;
    this.isDeletePopUp = true;
  }

  closeDeletePopUp() {
    this.deletingPlayerId = '';
    this.isDeletePopUp = false;
    this.isSendingDelete = false;
    this.errors = {};
  }

  confirmDelete() {
    this.isSendingDelete = true;
    this.api.deletePlayer(this.deletingPlayerId).subscribe({
      next: () => {
        this.closeDeletePopUp();
        this.outputUpdateUser.emit(true);
      },
      error: (err: any) => {
        this.closeDeletePopUp();
        this.infoService.showInfo('Taki gracz już nie istnieje');
        this.outputUpdateUser.emit(true);
      }
    });
  }

}
