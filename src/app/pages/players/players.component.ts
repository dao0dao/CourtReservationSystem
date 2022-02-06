import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Opponent, Player } from './interfaces';

type Overlap = 'add' | 'list';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  constructor(private api: ApiService) { }
  @Input() allOpponents: Opponent[] = [];

  overlap: Overlap = 'add';
  players: Player[] = [];

  changeOverlap(name: Overlap) {
    this.overlap = name;
  }

  ngOnInit(): void {
    this.api.getAllPlayers().subscribe({
      next: (res: Player[]) => {
        this.players = res;
        res.forEach(player => {
          this.allOpponents.push({ id: player.id!, name: player.name, surname: player.surname });
        });
      }
    });
  }

}
