import { Component, Input, OnInit } from '@angular/core';
import { LoginStateService } from '../login-state.service';
import { PriceList } from '../price-list/interfaces';
import { ApiService } from './api.service';
import { Opponent, Player } from './interfaces';


type Overlap = 'add' | 'list';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  constructor(private api: ApiService, public stateService: LoginStateService) { }
  @Input() allOpponents: Opponent[] = [];

  overlap: Overlap = 'list';
  players: Player[] = [];
  priceList: PriceList[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadPlayers();
    this.api.getPriceList().subscribe(res => { this.priceList = res; });
  }

  changeOverlap(name: Overlap) {
    this.overlap = name;
  }

  loadPlayers() {
    this.api.getAllPlayers().subscribe({
      next: (res: Player[]) => {
        this.players = res;
        res.forEach(player => {
          this.allOpponents.push({ id: player.id!, name: player.name, surname: player.surname });
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  reloadPlayers() {
    this.isLoading = true;
    this.players = [];
    this.allOpponents = [];
    this.loadPlayers();
  }

}
