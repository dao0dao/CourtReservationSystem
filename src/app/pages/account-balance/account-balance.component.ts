import { Component, OnInit } from '@angular/core';
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

  constructor(private api: ApiService, public selectHandler: SelectHandlerService,) { }

  players: Player[] = [];
  selectedPlayer: Player | undefined;
  playerInput: string = '';
  isLoadedPlayers: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';

  accountBalance: number | string = 120;
  history: Balance[] = [
    {
      id: '',
      date: '2022-06-30',
      service: 'Naciąganie rakiety',
      price: 35,
      isPaid: true,
      method: 'gotówka',
      beforePayment: 120,
      afterPayment: 110,
      cashier: 'Admin'
    },
    {
      id: '',
      date: '2022-06-29',
      service: 'Kort -1.5h',
      price: 30,
      isPaid: false,
      method: '',
      beforePayment: 120,
      afterPayment: 110,
      cashier: 'Admin'
    },
    {
      id: '',
      date: '2022-06-28',
      service: 'Kort -2h',
      price: 40,
      isPaid: true,
      method: 'przelew',
      beforePayment: 120,
      afterPayment: 110,
      cashier: 'Admin'
    }
  ];

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
    if (id === null) {
      this.resetInput();
      return;
    }
    this.selectedPlayer = this.players.find(pl => pl.id === id);
    this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

}
