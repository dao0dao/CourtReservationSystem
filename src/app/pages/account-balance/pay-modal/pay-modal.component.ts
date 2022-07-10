import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Balance, methodHistory, Payment } from '../interfaces';

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.scss']
})
export class PayModalComponent implements OnInit {

  @Input() payment: Balance | undefined;
  @Output() Pay: EventEmitter<any> = new EventEmitter();
  @Output() CloseModal: EventEmitter<Payment> = new EventEmitter();

  constructor() { }

  paymentMethod: methodHistory = 'cash';
  isSubmitting: boolean = false;

  ngOnInit(): void {
  }

  closeModal() {
    this.CloseModal.emit();
  }

  acceptPayment() {
    this.isSubmitting = true;
    const payment: Payment = {
      playerId: this.payment?.playerId!,
      historyId: this.payment?.id!,
      price: this.payment?.price!,
      service: this.payment?.service!,
      method: this.paymentMethod
    };
    this.Pay.emit(payment);
  }

}
