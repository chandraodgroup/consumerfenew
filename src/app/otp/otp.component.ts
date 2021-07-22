import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup , Validators  } from "@angular/forms";
import {ToastrService} from 'ngx-toastr'
import { OTPService } from '../services/otp.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  otpForm: FormGroup;
  submitted = false;

  userId: any;

  constructor( public router: Router,
    public fb: FormBuilder, private toastr: ToastrService , private otpService : OTPService) { 
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    })

  }

  get f() { return this.otpForm.controls; }

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.otpForm.invalid) {
      return;
     }else{ 

      const data ={
        otp : this.otpForm.value.otp,
        userId : this.userId,
      } ;

      this.otpService.submit_otp(data).subscribe(
        res=>{ 
          if(res.status==1){
            //let dd = JSON.parse(res.data);         
            this.toastr.success(res.message, 'Success', {
              timeOut: 4000,
              positionClass: 'toast-bottom-right'
            });
            this.router.navigate(['login']);
          }
          else{
            this.toastr.error(res.message, 'Error', {
              timeOut: 4000,
           positionClass: 'toast-bottom-right'
            });
          }  
      },
      error => {
        //console.log(error.error.message);
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 4000,
        positionClass: 'toast-bottom-right'
        });
      }
      );

     }
  }

  ngOnInit(): void {

    this.userId = localStorage.getItem('userId');

    if(this.userId=='' || this.userId==null){
      this.router.navigate(['']);
    }

  }

}
