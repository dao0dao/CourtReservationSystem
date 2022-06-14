import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { Player } from '../players/interfaces';
import { ApiService } from './api.service';
import { Action, Services } from './interfaces';
import { SelectHandlerService } from './select-handler.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(
    private api: ApiService,
    public selectHandler: SelectHandlerService,
    public loginService: LoginStateService
  ) { }

  environment = environment;

  services: Services[] = [
    { name: 'Opłata manipulacyjna', cost: 0 },
    { name: 'Wymiana naciągu', cost: 40 },
  ];

  players: Player[] = [];
  selectedPlayer: Player | undefined;
  playerInput: string = '';
  action: Action;

  inputCharge: number = 0;

  selectService: string = '';
  inputService: number | undefined;

  ngOnInit(): void {
    this.api.getAllPlayers().pipe(take(1)).subscribe((res) => {
      this.players = res;
      this.selectHandler.filteredPlayers = res;
    });
  }

  changeAction(name: Action) {
    this.action = name;
  }

  checkInput(e?: KeyboardEvent) {
    if (this.playerInput.length === 0 || !this.playerInput || (e?.key === 'Backspace' && this.selectedPlayer)) {
      this.resetPayments();
    }
  }

  resetPayments() {
    this.playerInput = '';
    this.action = undefined;
    this.selectedPlayer = undefined;
    this.inputCharge = 0;
  }

  selectPlayer() {
    this.selectedPlayer = this.selectHandler.selectPlayer();
    if (this.selectedPlayer) {
      this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
    } else {
      this.resetPayments();
    }
  }

  selectPlayerOnClick(id: string | null) {
    if (id === null) {
      this.resetPayments();
      return;
    }
    this.selectedPlayer = this.players.find(pl => pl.id === id);
    this.playerInput = this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

  checkCharge() {
    if (this.inputCharge !== undefined && (this.inputCharge < 0 || this.inputCharge === -0)) {
      this.inputCharge = 0;
    }
  }

  changeService() {
    if (this.selectService) {
      this.services.forEach(s => {
        if (s.name === this.selectService) {
          this.inputService = s.cost;
        }
      });
    } else {
      this.inputService = undefined;
    }
  }


}
