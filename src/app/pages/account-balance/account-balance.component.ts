import { Component, OnInit } from '@angular/core';
import { LoginStateService } from '../login-state.service';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { Balance } from './interfaces';
import { SelectHandlerService } from './select-handler.service';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent implements OnInit {

  constructor(
    private api: ApiService,
    public selectHandler: SelectHandlerService,
    public state: LoginStateService
  ) { }

  today: string = new Date().toLocaleDateString();

  players: Player[] = [];
  selectedPlayer: Player | undefined;
  playerInput: string = '';
  isLoadedPlayers: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';

  isLoading: boolean = false;
  accountBalance: number | string = '';
  history: Balance[] = [];
  filteredHistory: Balance[] = [];

  isNotPaid: boolean = false;
  isGame: boolean = false;
  isNotPaidGame: boolean = false;

  ngOnInit(): void {
    this.api.getAllPlayers().subscribe((res) => {
      this.players = res;
      this.selectHandler.filteredPlayers = res;
      this.isLoadedPlayers = true;
    });
    this.dateTo = new Date().toISOString().slice(0, 10);
  }

  resetInput() {
    this.selectedPlayer = undefined;
    this.playerInput = '';
    this.history = [];
    this.filteredHistory = [];
    this.accountBalance = '';
    this.isNotPaid = false;
    this.isGame = false;
    this.isNotPaidGame = false;
  }

  checkInput(e?: KeyboardEvent) {
    if (this.playerInput.length === 0 || !this.playerInput || (e?.key === 'Backspace' && this.selectedPlayer)) {
      this.resetInput();
    }
  }

  selectPlayer() {
    this.selectedPlayer = this.selectHandler.selectPlayer();
    if (this.selectedPlayer) {
      this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
    } else {
      this.resetInput();
    }
  }

  selectPlayerOnClick(id: string | null) {
    this.resetInput();
    if (id === null) { return; }
    this.selectedPlayer = this.players.find(pl => pl.id === id);
    this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

  checkDate() {
    if (this.dateFrom && this.dateTo) {
      const from = new Date(this.dateFrom).getTime();
      const to = new Date(this.dateTo).getTime();
      from > to ? this.dateFrom = '' : null;
    }
  }

  showBalance() {
    this.accountBalance = '';
    this.api.getPlayerBalance(this.selectedPlayer?.id!).subscribe((res) => {
      this.accountBalance = res.balance;
    });
  }

  showHistory() {
    this.isLoading = true;
    this.history = [];
    this.filteredHistory = [];
    const stampTo: string = ' 23:59:59';
    const stampFrom: string = ' 00:00:00';
    const dateFrom: string = this.dateFrom ? (this.dateFrom + stampFrom) : '';
    const dateTo: string = this.dateTo ? (this.dateTo + stampTo) : '';
    this.showBalance();
    this.api.getPlayerHistory(this.selectedPlayer?.id!, { dateFrom, dateTo })
      .subscribe(res => { this.isLoading = false; this.history = res; this.filteredHistory = res; });
  }

  showOnlyNotPaid() {
    this.isGame = false;
    this.isNotPaidGame = false;
    if (this.isNotPaid) {
      this.filteredHistory = [...this.history.filter(el => el.isPaid === false)];
    } else {
      this.filteredHistory = [...this.history];
    }
  }

  showOnlyGames() {
    this.isNotPaid = false;
    this.isNotPaidGame = false;
    if (this.isGame) {
      this.filteredHistory = [...this.history.filter(el => el.method === 'game')];
    } else {
      this.filteredHistory = [...this.history];
    }
  }

  showOnlyNotPaidGames() {
    this.isNotPaid = false;
    this.isGame = false;
    if (this.isNotPaidGame) {
      this.filteredHistory = [...this.history.filter(el => el.method === 'game' && el.isPaid === false)];
    } else {
      this.filteredHistory = [...this.history];
    }
  }

}
