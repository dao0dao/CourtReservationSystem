import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  loginForm: FormGroup = new FormGroup({});

  get nick() {
    return this.loginForm.get('nick');
  }

  get password() {
    return this.loginForm.get('password');
  }

  logIn() {
    this.http.post(environment.apiLink + 'login', { nick: this.nick?.value, password: this.password?.value }).subscribe({
      next: (res) => { console.log(res); },
      error: (err) => { console.log(err); }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nick: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

}
