import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Player } from '../../players/interfaces';

@Component({
  selector: 'app-timetable-modal',
  templateUrl: './timetable-modal.component.html',
  styleUrls: ['./timetable-modal.component.scss']
})
export class TimetableModalComponent implements OnInit {

  environment = environment;

  constructor(private fb: FormBuilder) { }

  @Input() modalAction: 'new' | 'edit' | undefined;
  @Input() players: Player[] = [];
  @Input() date: string = '';
  @Output() outputCloseModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  playerOne: Player[] = [];
  playerTwo: Player[] = [];

  form: FormGroup = new FormGroup({});


  ngOnInit(): void {
    this.playerOne = this.players;
    this.playerTwo = this.players;
    this.form = this.fb.group({
      date: [this.date, [Validators.required]]
    });
  }

  closeModal() {
    this.outputCloseModal.emit(true);
  }

}
