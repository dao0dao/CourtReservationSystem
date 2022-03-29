import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  getFormField(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  isListOne: boolean = true;
  isListTwo: boolean = true;
  isPlayerChosen: boolean = false;

  ngOnInit(): void {
    this.playerOne = this.players;
    this.playerTwo = this.players;
    this.setForm();
  }

  closeModal() {
    this.outputCloseModal.emit(true);
  }

  setForm() {
    this.form = this.fb.group({
      date: [this.date, [Validators.required]],
      from: [this.date, [Validators.required]],
      to: [this.date, [Validators.required]],
      playerOne: [''],
      playerTwo: [''],
      guestOne: [''],
      guestTwo: [''],
      court: ['', [Validators.required]],
      // obsługa wyboru
      listOne: ['true'],
      listTwo: ['true'],
    });
  }

  handleChoseOne() {
    if (this.getFormField('listOne')?.value == 'true') {
      this.isListOne = true;
    }
    if (this.getFormField('listOne')?.value == 'false') {
      this.isListOne = false;
    }
    this.handleIsPlayerChosen();
  }

  handleChoseTwo() {
    if (this.getFormField('listTwo')?.value == 'true') {
      this.isListTwo = true;
    }
    if (this.getFormField('listTwo')?.value == 'false') {
      this.isListTwo = false;
    }
    this.handleIsPlayerChosen();
  }

  handleIsPlayerChosen() {
    const playerOne = this.getFormField('playerOne')?.value;
    const playerTwo = this.getFormField('playerTwo')?.value;
    const guestOne = this.getFormField('guestOne')?.value;
    const guestTwo = this.getFormField('guestTwo')?.value;
    if (
      (playerOne && this.isListOne) ||
      (guestOne && !this.isListOne) ||
      (playerTwo && this.isListTwo) ||
      (guestTwo && !this.isListTwo)
    ) {
      this.isPlayerChosen = true;
    } else {
      this.isPlayerChosen = false;
    }
  }

  submitForm() {
    console.log(this.form.value);
  }

}
