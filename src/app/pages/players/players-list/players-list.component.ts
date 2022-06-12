import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { EditPlayerError, Opponent, OpponentSql, Player, PlayerSql, Week } from '../interfaces';
import { LoginStateService } from '../../login-state.service';
import { animations } from './animations';
import { SearchingService } from '../searching.service';
import { PriceList } from '../../price-list/interfaces';

interface Sort {
  surname: { isActive: boolean, top: boolean; },
  name: { isActive: boolean, top: boolean; },
  page: number;
}

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
  animations: animations
})
export class PlayersListComponent implements OnInit, OnChanges, DoCheck {
  environment = environment;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private infoService: InfoService,
    private loginStateService: LoginStateService,
    public searchingService: SearchingService
  ) { }

  @Input() players: Player[] = [];
  @Input() allOpponents: Opponent[] = [];
  @Input() priceList: PriceList[] = [];
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

  sortedView: Sort = {
    surname: { isActive: true, top: true },
    name: { isActive: false, top: true },
    page: 1
  };
  search: string = '';
  isSearchWeek: boolean = false;
  searchWeek: Week | any = {};

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;

  ngOnInit(): void {

    this.formEditPlayer = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.email]],
      priceListId: [''],
      court: [0],
      strings: ['', Validators.maxLength(250)],
      tension: ['', Validators.maxLength(250)],
      racquet: ['', Validators.maxLength(150)],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngDoCheck(): void {
    if (this.loginStateService.state.isAdmin === true && this.isAdmin === false) {
      this.isAdmin = true;
    }
    this.pageCount = Math.ceil(this.filteredPlayers.length / this.itemsPerPage);
    if (this.page > this.pageCount) {
      this.page = this.pageCount;
    }
    if (this.page < 1) {
      this.page = 1;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players'].currentValue != changes['players'].previousValue) {
      this.filteredPlayers = [...this.players];
      this.sortBy('surname');
    }
  }

  getField(name: string): AbstractControl | null {
    return this.formEditPlayer.get(name);
  }

  resetForm() {
    this.formEditPlayer.reset();
    this.changeStatus = !this.changeStatus;
    this.getField('id')?.setValue('');
    this.getField('priceListId')?.setValue('');
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
    this.getField('priceListId')?.setValue(player.priceListId);
    this.getField('court')?.setValue(player.court);
    this.getField('strings')?.setValue(player.stringsName);
    this.getField('tension')?.setValue(player.tension);
    this.getField('racquet')?.setValue(player.racquet);
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
    const { id, name, surname, telephone, email, account, priceListId, court, strings, tension, racquet, notes } = this.formEditPlayer.value;
    const player: PlayerSql = {
      weeks: this.updatedWeeks,
      opponents: this.updatedOpponents,
      id, name, surname, telephone, email, account, priceListId, court, stringsName: strings, tension, racquet, notes
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

  sortBy(property: 'name' | 'surname', changeDirections: boolean = true) {
    if (changeDirections) {
      if (property === 'name' && this.sortedView.name.isActive) {
        this.sortedView.name.top = !this.sortedView.name.top;
        this.sortUp(property, this.sortedView.name.top);
      } else if (property === 'name' && !this.sortedView.name.isActive) {
        this.sortedView.name.isActive = true;
        this.sortedView.surname.isActive = false;
        this.sortUp(property, this.sortedView.name.top);
      } else if (property === 'surname' && this.sortedView.surname.isActive) {
        this.sortedView.surname.top = !this.sortedView.surname.top;
        this.sortUp(property, this.sortedView.surname.top);
      } else if (property === 'surname' && !this.sortedView.surname.isActive) {
        this.sortedView.name.isActive = false;
        this.sortedView.surname.isActive = true;
        this.sortUp(property, this.sortedView.surname.top);
      }
    } else {
      if (property === 'name') {
        this.sortUp(property, this.sortedView.name.top);
      } else if (property === 'surname') {
        this.sortUp(property, this.sortedView.surname.top);
      }

    }
  }

  private sortUp(property: 'name' | 'surname', up: boolean) {
    if (up) {
      this.filteredPlayers.sort((a, b) => {
        if (a[property] < b[property]) { return -1; }
        if (a[property] > b[property]) { return 1; }
        return 0;
      });
    } else {
      this.filteredPlayers.sort((a, b) => {
        if (a[property] > b[property]) { return -1; }
        if (a[property] < b[property]) { return 1; }
        return 0;
      });
    }
  }

  searchForWeek(event: Week) {
    this.searchWeek = event;
    this.filteredPlayers = this.searchingService.searchFor(this.search, this.searchWeek, this.players);
    if (this.sortedView.name.isActive) {
      this.sortBy('name', false);
    } else {
      this.sortBy('surname', false);
    }
  }

  searchFor() {
    this.filteredPlayers = this.searchingService.searchFor(this.search, this.searchWeek, this.players);
    if (this.sortedView.name.isActive) {
      this.sortBy('name', false);
    } else {
      this.sortBy('surname', false);
    }
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

}
