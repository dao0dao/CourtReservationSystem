import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HourPrice, ModalAction, PriceList } from '../interfaces';

@Component({
  selector: 'app-price-list-modal',
  templateUrl: './price-list-modal.component.html',
  styleUrls: ['./price-list-modal.component.scss']
})
export class PriceListModalComponent implements OnInit {

  environment = environment;

  @Input() action: ModalAction | undefined;
  @Input() priceList: PriceList | undefined;
  @Output() outputClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() outputNewList: EventEmitter<PriceList> = new EventEmitter<PriceList>();

  fields: { [key: string]: HourPrice; } = {};

  form: FormGroup = new FormGroup({});
  isSameHours: boolean = false;
  sameHoursIndex: string = '';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.action === 'new' || this.action === 'edit') {
      this.form = this.fb.group({
        'name': ['', [Validators.required, Validators.maxLength(150)]]
      });
    }
    if (this.action === 'new') {
      this.addField();
    }
    if (this.action === 'edit' && this.priceList) {
      this.fields = this.priceList.hours;
      this.form.get('name')?.setValue(this.priceList.name);
      this.setFormForEdition();
      this.form.updateValueAndValidity();
    }
  }

  getField(groupNumber: string, fieldName: string) {
    const group = this.form.get('group-' + groupNumber);
    const field = group?.get(fieldName);
    return field;
  }

  getGroup(groupNumber: string) {
    return this.form.get('group-' + groupNumber);
  }

  addField() {
    let lastIndex: number = 0;
    Object.keys(this.fields).forEach(k => parseInt(k) >= lastIndex ? lastIndex = parseInt(k) + 1 : null);
    const field: HourPrice = { from: '', to: '', price: 0 };
    const fields = this.fb.group({
      'from': ['', Validators.required],
      'to': ['', Validators.required],
      'price': ['', [Validators.required, Validators.min(0)]],
    });
    const groupName = 'group-' + lastIndex;
    this.fields[lastIndex] = field;
    this.form.addControl(groupName, fields);
    this.form.updateValueAndValidity();
  }

  removeField(groupNumber: string) {
    const groupName = 'group-' + groupNumber;
    this.form.removeControl(groupName);
    this.form.updateValueAndValidity();
    delete this.fields[groupNumber];
  }

  isErrorRequired(groupNumber: string): boolean | undefined {
    const isFrom = this.getField(groupNumber, 'from')?.invalid && this.getField(groupNumber, 'from')?.touched;
    const isTo = this.getField(groupNumber, 'to')?.invalid && this.getField(groupNumber, 'to')?.touched;
    const isPrice = this.getField(groupNumber, 'price')?.invalid && this.getField(groupNumber, 'price')?.touched;
    return isFrom || isTo || isPrice;
  }

  validateSameHours() {
    this.checkCoveringHours();
    this.checkFromToHours();
  }

  checkCoveringHours() {
    let isError: boolean = false;
    let sameHourIndex: string = '';
    for (let i in this.fields) {
      const fromA = parseFloat((this.getField(i, 'from')?.value).replace(':', '.'));
      const toA = parseFloat((this.getField(i, 'to')?.value).replace(':', '.'));
      for (let j in this.fields) {
        if (i != j) {
          const fromB = parseFloat((this.getField(j, 'from')?.value).replace(':', '.'));
          const toB = parseFloat((this.getField(j, 'to')?.value).replace(':', '.'));
          if (
            fromA < fromB && toA > fromB ||
            fromA >= fromB && toA <= toB ||
            fromA < toB && toA > toB
          ) {
            isError = true;
            sameHourIndex = i;
          }
        }
      }
    }
    this.isSameHours = isError;
    this.sameHoursIndex = sameHourIndex;
  }

  checkFromToHours() {
    
  }

  setFormForEdition() {
    for (let i in this.priceList?.hours) {
      const { from, to, price } = this.priceList?.hours[i]!;
      const groupName = 'group-' + i;
      const fields = this.fb.group({
        'from': [from, Validators.required],
        'to': [to, Validators.required],
        'price': [price, [Validators.required, Validators.min(0)]],
      });
      this.form.addControl(groupName, fields);
    }
  }

  submit() {
    const priceList: PriceList = {
      id: this.priceList?.id,
      name: this.form.get('name')?.value,
      hours: this.fields
    };
    for (let i in this.fields) {
      const { hours } = priceList;
      hours[i].from = this.getField(i, 'from')?.value;
      hours[i].to = this.getField(i, 'to')?.value;
      hours[i].price = this.getField(i, 'price')?.value;
    }
    this.outputNewList.emit(priceList);
  }

  closeModal() {
    this.outputClose.emit(true);
  }

}
