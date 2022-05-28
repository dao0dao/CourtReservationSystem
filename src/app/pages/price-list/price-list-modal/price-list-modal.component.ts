import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ModalAction } from '../interfaces';

@Component({
  selector: 'app-price-list-modal',
  templateUrl: './price-list-modal.component.html',
  styleUrls: ['./price-list-modal.component.scss']
})
export class PriceListModalComponent {

  environment = environment;

  @Input() action: ModalAction | undefined;
  @Output() outputClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  fields: any[] = [1, 2, 3 ];

  constructor() { }

  closeModal() {
    this.outputClose.emit(true);
  }

}
