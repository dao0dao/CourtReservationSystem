import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Opponent } from '../../interfaces';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss']
})
export class OpponentComponent implements OnInit {

  @Output() outputOpponents: EventEmitter<Opponent[]> = new EventEmitter<Opponent[]>();

  environment = environment;

  constructor(private fb: FormBuilder) { }

  formOpponent: FormGroup = new FormGroup({});

  opponents: Opponent[] = [
    { name: 'Demid', surname: 'Greshnikov', playerId: 'fdafaqq' },
    { name: 'Aleksandra', surname: 'Greshnikova', playerId: 'ghadusiol' },
    { name: 'Jarosław', surname: 'Bielecki', playerId: 'fhguidoal' },
    { name: 'Marta', surname: 'Bielecka', playerId: 'fhdiuoa' }
  ];

  chosenOpponents: Opponent[] = [];

  addOpponent() {
    const index = parseInt(this.formOpponent.get('opponent')?.value);
    let isChosen: boolean = false;
    this.chosenOpponents.forEach(o => {
      if (o.playerId === this.opponents[index].playerId) {
        isChosen = true;
      }
    });
    if (!isChosen) {
      this.chosenOpponents.push(this.opponents[index]);
    }
    this.outputOpponents.emit(this.chosenOpponents);
    this.formOpponent.reset();
  }

  removeOpponent(index: number) {
    this.chosenOpponents.splice(index, 1);
    this.outputOpponents.emit(this.chosenOpponents);
  }

  ngOnInit(): void {
    this.formOpponent = this.fb.group({
      opponent: ['', Validators.required]
    });
  }

}
