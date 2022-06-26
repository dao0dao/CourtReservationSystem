import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { Services } from '../interfaces';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  environment = environment;

  constructor(private fb: FormBuilder, private api: ApiService) { }

  @Input() services: { [key: string]: Services; } = {};
  @Output() outputCloseServiceList: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    for (let i in this.services) {
      this.addFields(i, this.services[i].name, this.services[i].cost, this.services[i].id!);
    }
    this.form.updateValueAndValidity();
  }

  getGroup(index: string) {
    return this.form.get('group-' + index);
  };
  getField(groupNumber: string, fieldName: string) {
    return this.getGroup(groupNumber)?.get(fieldName);
  }

  addFields(index: string, serviceName: string, value: number, serviceId: string) {
    const group = this.fb.group({
      id: [serviceId],
      name: [serviceName, [Validators.required, Validators.maxLength(50)]],
      cost: [value, [Validators.required, Validators.min(0)]]
    });
    const groupName = 'group-' + index;
    this.form.addControl(groupName, group);
  }

  addField() {
    let lastIndex: number = 0;
    Object.keys(this.services).forEach(k => parseInt(k) >= lastIndex ? lastIndex = parseInt(k) + 1 : null);
    this.addFields(lastIndex.toString(), '', 0, '');
    this.form.updateValueAndValidity();
    this.services[lastIndex] = { name: '', cost: 0 };
  }

  removeField(key: string) {
    this.services[key].isDeleting = true;
    if (this.services[key].id) {
      this.api.deleteService(this.services[key].id!).subscribe({
        next: () => {
          const groupName = 'group-' + key;
          this.form.removeControl(groupName);
          this.form.updateValueAndValidity();
          delete this.services[key];
        },
        error: () => {
          this.services[key].isDeleting = false;
        }
      });
    } else {
      const groupName = 'group-' + key;
      this.form.removeControl(groupName);
      this.form.updateValueAndValidity();
      delete this.services[key];
    }
  }

  closeList() {
    this.outputCloseServiceList.emit(true);
  }

  submit() {
    const data: { [key: string]: Services; } = {};
    for (let i in this.form.value) {
      const groupNumber = i.slice(i.lastIndexOf('-') + 1);
      data[groupNumber] = this.form.value[i];
    }
    this.api.submitList(data).subscribe({
      next: (res) => {
        this.services = {};
        this.closeList();
      },
      error: (err) => {
        this.closeList();
      }
    });
  }

}
