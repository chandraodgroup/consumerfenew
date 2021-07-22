import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { LoginService } from '../services/login.service';
import { TokenService } from '../shared/token.service';
import { AuthStateService } from '../shared/auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errors = null;

  submitted=false;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: LoginService,
    private token: TokenService,
    private authState: AuthStateService,
  ) {
    

    this.loginForm = this.fb.group({
      email: [null],
      phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
    })

}


  getLogin(e:any){

    this.submitted=false;

    this.loginForm = this.fb.group({
      email: [null],
      phone: [null]
    })

    let v= e.target.value;

    if(v=='phone'){

      this.loginForm = this.fb.group({
        email: [null],
        phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      })

      // $(".email").hide();
      // $(".phone").show();
    }

    if(v=='email'){

      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: [null]
      })
      
      // $(".email").show();
      // $(".phone").hide();
    }

  }


  get f() { return this.loginForm.controls; }

  onSubmit() {

    this.submitted=true;

    if(this.loginForm.invalid){
       return;
    }else{
      this.authService.signin(this.loginForm.value).subscribe(
        res => {
          console.log(res);
          //this.responseHandler(res);
        },
        error => {
          this.errors = error.error;
        },() => {
          this.authState.setAuthState(true);
          this.loginForm.reset()
          this.router.navigate(['booking']);
        });

    }

    
}

// Handle response
responseHandler(data:any){
  this.token.handleData(data.access_token);
}

  ngOnInit(): void {
  }

}
