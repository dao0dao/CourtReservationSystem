import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AddPlayerError, Opponent, Player } from '../interfaces';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent implements OnInit, OnChanges {
  environment = environment;

  constructor(private fb: FormBuilder) { }

  @Input() players: Player[] = [];
  @Input() allOpponents: Opponent[] = [];

  filteredPlayers: Player[] = [];
  changeStatus: boolean = false;
  errors: AddPlayerError = {};

  formEditPlayer: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.formEditPlayer = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(15), Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.email]],
      account: [0, [Validators.required, Validators.min(0)]],
      priceSummer: [0, [Validators.min(0), Validators.max(1000)]],
      priceWinter: [0, [Validators.min(0), Validators.max(1000)]],
      court: [0],
      strings: ['', Validators.maxLength(20)],
      tension: [25, [Validators.min(15), Validators.max(35)]],
      balls: ['', Validators.maxLength(20)],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['players'].currentValue != changes['players'].previousValue) {
      this.filteredPlayers = [...this.players];
    }
  }

  setWeeks(event: any) {
  }

  setOpponents(event: any) {

  }

}
