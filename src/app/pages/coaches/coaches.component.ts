import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginStateService } from '../login-state.service';
import { ApiService } from './api.service';
import { User } from './interfaces';
import { InfoService } from '../../info.service';

type Overlap = 'user' | 'list' | 'add';

interface userError extends Error {
  error: {
    name: boolean,
    login: boolean,
    newPassword: boolean,
    confirmNewPassword: boolean;
  };
}


@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {

  constructor(public loginState: LoginStateService, private api: ApiService, private fb: FormBuilder, private infoService: InfoService) { }

  overlap: Overlap = 'add';
  user: User = {} as any;
  samePassword: boolean = true;

  userForm: FormGroup = new FormGroup({});
  get name() { return this.userForm.get('name'); }
  get nick() { return this.userForm.get('nick'); }
  get newPassword() { return this.userForm.get('newPassword'); }
  get confirmNewPassword() { return this.userForm.get('confirmNewPassword'); }

  toggleList(tab: Overlap) {
    this.overlap = tab;
  }

  checkPassword() {
    if (this.newPassword?.value || this.confirmNewPassword?.value) {
      this.newPassword?.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
      this.confirmNewPassword?.setValidators([Validators.required, Validators.minLength(5), Validators.maxLength(10)]);
      this.newPassword?.value === this.confirmNewPassword?.value ? this.samePassword = true : this.samePassword = false;
    } else {
      this.newPassword?.clearValidators();
      this.confirmNewPassword?.clearValidators();
      this.samePassword = true;
    }
    this.newPassword?.updateValueAndValidity();
    this.confirmNewPassword?.updateValueAndValidity();
  }

  submit() {
    const body: User = {
      name: this.name?.value,
      login: this.nick?.value,
      newPassword: this.newPassword?.value,
      confirmNewPassword: this.confirmNewPassword?.value
    };
    this.api.updateUser(body).subscribe({
      next: () => {
        this.infoService.showInfo('Zaktualizowano dane', true);
        this.newPassword?.reset();
        this.confirmNewPassword?.reset();
        this.checkPassword();
      },
      error: (error: userError) => {
        const err = error.error;
        err.name === false ? this.name?.setErrors({ incorrect: true }) : null;
        err.login === false ? this.nick?.setErrors({ incorrect: true }) : null;
        err.newPassword === false ? this.newPassword?.setErrors({ incorrect: true }) : null;
        err.confirmNewPassword === false ? this.confirmNewPassword?.setErrors({ incorrect: true }) : null;
      }
    });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      nick: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      newPassword: [''],
      confirmNewPassword: ['']
    });
    this.api.getUser().subscribe({
      next: (res) => {
        this.name?.setValue(res.name);
        this.nick?.setValue(res.login);
      }
    });
  }

}
