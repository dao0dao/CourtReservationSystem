import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

type Overlap = 'add' | 'list';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  constructor(private api: ApiService) { }

  overlap: Overlap = 'add';

  changeOverlap(name: Overlap) {
    this.overlap = name;
  }

  ngOnInit(): void {
    this.api.getAllPlayers().subscribe({
      next: (res) => {
        console.log(res);
      }
    });
  }

}
