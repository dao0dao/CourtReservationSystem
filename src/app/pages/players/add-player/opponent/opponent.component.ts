import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Opponent } from '../../interfaces';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss']
})
export class OpponentComponent implements OnInit, OnChanges {

  @Output() outputOpponents: EventEmitter<Opponent[]> = new EventEmitter<Opponent[]>();
  @Input() opponents: Opponent[] = [];
  @Input() changeStatus: boolean = false;

  environment = environment;

  constructor(private fb: FormBuilder) { }

  formOpponent: FormGroup = new FormGroup({});

  filteredOpponents: Opponent[] = [];

  chosenOpponents: Opponent[] = [];

  addOpponent() {
    const id: string = this.formOpponent.get('opponent')?.value;
    const index: number = this.filteredOpponents.findIndex(op => op.id === id);
    this.chosenOpponents.push(this.filteredOpponents[index]);
    this.outputOpponents.emit(this.chosenOpponents);
    this.formOpponent.reset();
    this.filteredOpponents.splice(index, 1);
  }

  removeOpponent(id: string) {
    const index: number = this.chosenOpponents.findIndex(op => op.id === id);
    this.chosenOpponents.splice(index, 1);
    const op: Opponent = this.opponents.find(el => el.id === id)!;
    this.filteredOpponents.push(op);
    this.outputOpponents.emit(this.chosenOpponents);
  }

  ngOnInit(): void {
    this.formOpponent = this.fb.group({
      opponent: ['', Validators.required]
    }); 
    this.filteredOpponents = [...this.opponents];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['changeStatus'].currentValue != changes['changeStatus'].previousValue) {
      this.formOpponent.reset();
      this.filteredOpponents = [...this.opponents];
      this.outputOpponents.emit([]);
    }
  }

}
