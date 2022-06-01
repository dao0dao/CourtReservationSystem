import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PriceList } from '../interfaces';

@Component({
  selector: 'app-price-delete-modal',
  templateUrl: './price-delete-modal.component.html',
  styleUrls: ['./price-delete-modal.component.scss']
})
export class PriceDeleteModalComponent implements OnInit {

  @Input() priceList: PriceList | undefined;
  @Output() outputConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  confirm() {
    this.outputConfirm.emit(true);
  }

  decline() {
    this.outputConfirm.emit(false);
  }

}
