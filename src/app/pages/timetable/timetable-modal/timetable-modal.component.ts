import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Player } from '../../players/interfaces';
import { ActiveFilters } from '../intefaces';
import { FilterPlayersService } from './filter-players.service';

@Component({
  selector: 'app-timetable-modal',
  templateUrl: './timetable-modal.component.html',
  styleUrls: ['./timetable-modal.component.scss']
})
export class TimetableModalComponent implements OnInit {

  environment = environment;

  constructor(private fb: FormBuilder, private filter: FilterPlayersService) { }

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
  isTimeChosen: boolean = false;

  activeFilers: ActiveFilters = {
    playerOne: { isActive: false },
    playerTwo: { isActive: false },
    allOpponentsOne: { isActive: false, isDisabled: true },
    allOpponentsTwo: { isActive: false, isDisabled: true },
    opponentOne: { isActive: false, isDisabled: true },
    opponentTwo: { isActive: false, isDisabled: true },
  };

  ngOnInit(): void {
    this.playerOne = [...this.players];
    this.playerTwo = [...this.players];
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

  handleIsTimeChosen() {
    if (this.getFormField('from')?.value.length == 5 && this.getFormField('to')?.value.length == 5) {
      this.isTimeChosen = true;
    } else {
      this.isTimeChosen = false;
    }
  }

  handleTypeChoseOne() {
    if (this.getFormField('listOne')?.value == 'true') {
      this.isListOne = true;
      this.getFormField('guestOne')?.setValue('');
      this.form.updateValueAndValidity();
    }
    if (this.getFormField('listOne')?.value == 'false') {
      this.isListOne = false;
      this.getFormField('playerOne')?.setValue('');
      this.form.updateValueAndValidity();
    }
    this.handleIsPlayerChosen();
  }

  handleTypeChoseTwo() {
    if (this.getFormField('listTwo')?.value == 'true') {
      this.isListTwo = true;
      this.getFormField('guestTwo')?.setValue('');
      this.form.updateValueAndValidity();
    }
    if (this.getFormField('listTwo')?.value == 'false') {
      this.isListTwo = false;
      this.getFormField('playerTwo')?.setValue('');
      this.form.updateValueAndValidity();
    }
    this.handleIsPlayerChosen();
  }

  private switchTypeToList(list: 'listOne' | 'listTwo') {
    if (list === 'listOne') {
      this.isListOne = true;
      this.getFormField('guestOne')?.setValue('');
      this.getFormField('playerOne')?.setValue('');
    }
    if (list === 'listTwo') {
      this.isListTwo = true;
      this.getFormField('guestTwo')?.setValue('');
      this.getFormField('playerTwo')?.setValue('');
    }
    this.getFormField(list)?.setValue('true');
    this.form.updateValueAndValidity();
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
    this.handleActivateOpponentsFilter();
  }

  private handleActivateOpponentsFilter() {
    const playerOne = this.getFormField('playerOne')?.value;
    const playerTwo = this.getFormField('playerTwo')?.value;
    if ((playerOne && this.isListOne) && !playerTwo) {
      this.activeFilers.allOpponentsOne.isDisabled = false;
      this.activeFilers.opponentOne.isDisabled = false;
    } else {
      this.activeFilers.allOpponentsOne.isDisabled = true;
      this.activeFilers.opponentOne.isDisabled = true;
    }
    if ((playerTwo && this.isListTwo) && !playerOne) {
      this.activeFilers.allOpponentsTwo.isDisabled = false;
      this.activeFilers.opponentTwo.isDisabled = false;
    } else {
      this.activeFilers.allOpponentsTwo.isDisabled = true;
      this.activeFilers.opponentTwo.isDisabled = true;
    }
  }

  private resetOponentFilterOne() {
    this.activeFilers.allOpponentsOne.isActive = false;
    this.activeFilers.opponentOne.isActive = false;
    this.playerTwo = [...this.players];
  }

  private resetOponentFilterTwo() {
    this.activeFilers.allOpponentsTwo.isActive = false;
    this.activeFilers.opponentTwo.isActive = false;
    this.playerOne = [...this.players];
  }

  private findPlayer(): Player[] {
    return this.filter.findPlayers(this.players, this.getFormField('from')?.value, this.getFormField('to')?.value, this.getFormField('date')?.value);
  }

  private findAllOpponents(playerId: string, players: Player[]) {
    return this.filter.findAllOpponents(playerId, players);
  }

  findPlayerOne() {
    if (!this.activeFilers.playerOne.isActive) {
      this.switchTypeToList('listOne');
      this.playerOne = [...this.findPlayer()];
      this.activeFilers.playerOne.isActive = true;
      this.activeFilers.allOpponentsTwo.isDisabled = true;
      this.activeFilers.opponentTwo.isDisabled = true;
    } else {
      this.playerOne = [...this.players];
      this.activeFilers.playerOne.isActive = false;
      this.activeFilers.allOpponentsTwo.isDisabled = false;
      this.activeFilers.opponentTwo.isDisabled = false;
      if (this.activeFilers.allOpponentsOne.isActive || this.activeFilers.opponentOne.isActive) {
        this.resetOponentFilterOne();
      }
    }
    this.handleActivateOpponentsFilter();
  }

  findAllOpponentsOne() {
    if (!this.activeFilers.allOpponentsOne.isActive) {
      const playerId = this.getFormField('playerOne')?.value;
      this.switchTypeToList('listTwo');
      this.playerTwo = [...this.findAllOpponents(playerId, this.players)];
      this.activeFilers.allOpponentsOne.isActive = true;
      this.activeFilers.opponentOne.isActive = false;
      this.activeFilers.allOpponentsTwo.isDisabled = true;
      this.activeFilers.opponentTwo.isDisabled = true;
    } else {
      this.playerTwo = [...this.players];
      this.activeFilers.allOpponentsOne.isActive = false;
      this.activeFilers.allOpponentsTwo.isDisabled = false;
      this.activeFilers.opponentTwo.isDisabled = false;
      if (this.activeFilers.allOpponentsTwo.isActive || this.activeFilers.opponentTwo.isActive) {
        this.resetOponentFilterTwo();
      }
    }
  }

  findPlayerTwo() {
    if (!this.activeFilers.playerTwo.isActive) {
      this.switchTypeToList('listTwo');
      this.playerTwo = [...this.findPlayer()];
      this.activeFilers.playerTwo.isActive = true;
      this.activeFilers.allOpponentsOne.isDisabled = true;
      this.activeFilers.opponentOne.isDisabled = true;
    } else {
      this.playerTwo = [...this.players];
      this.activeFilers.playerTwo.isActive = false;
      this.activeFilers.allOpponentsOne.isDisabled = false;
      this.activeFilers.opponentOne.isDisabled = false;
    }
    this.handleActivateOpponentsFilter();
  }

  findAllOpponentsTwo() {
    if (!this.activeFilers.allOpponentsTwo.isActive) {
      const playerId = this.getFormField('playerTwo')?.value;
      this.switchTypeToList('listOne');
      this.playerOne = [...this.findAllOpponents(playerId, this.players)];
      this.activeFilers.allOpponentsTwo.isActive = true;
      this.activeFilers.opponentTwo.isActive = false;
      this.activeFilers.allOpponentsOne.isDisabled = true;
      this.activeFilers.opponentOne.isDisabled = true;
    } else {
      this.playerTwo = [...this.players];
      this.activeFilers.allOpponentsTwo.isActive = false;
      this.activeFilers.allOpponentsOne.isDisabled = false;
      this.activeFilers.opponentOne.isDisabled = false;
      if (this.activeFilers.allOpponentsOne.isActive || this.activeFilers.opponentOne.isActive) {
        this.resetOponentFilterOne();
      }
    }
  }

  submitForm() {
    console.log(this.form.value);
  }

}
