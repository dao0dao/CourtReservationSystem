import { Component, OnInit } from '@angular/core';
import { LoginStateService } from '../login-state.service';

type Overlap = 'user' | 'list' | 'add';

@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {

  constructor(public loginState: LoginStateService) { }

  overlap: Overlap = 'user';

  toggleList(tab: Overlap) {
    this.overlap = tab;
  }

  ngOnInit(): void {
  }

}
