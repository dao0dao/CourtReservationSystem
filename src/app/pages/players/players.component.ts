import { Component, OnInit } from '@angular/core';

type Overlap = 'add' | 'list';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {

  constructor() { }

  overlap: Overlap = 'add';

  changeOverlap(name: Overlap) {
    this.overlap = name;
  }

  ngOnInit(): void {
  }

}
