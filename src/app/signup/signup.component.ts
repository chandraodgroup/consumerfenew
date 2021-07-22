import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup , Validators  } from "@angular/forms";
import { MustMatch } from '../helpers/must-match.validator';
import { AuthService } from '../shared/auth.service';
import { TokenService } from '../shared/token.service';
import { AuthStateService } from '../shared/auth-state.service';
import { SignupService } from '../services/signup.service';


import {ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  submitted = false;

  constructor( public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService, 
    private signupService: SignupService, private toastr: ToastrService) { 

      this.signupForm = this.fb.group({
        name: ['', Validators.required],
        email: [null],
        phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      })

    //   this.signupForm = this.fb.group({
    //     name: ['', Validators.required],
    //     email: ['', [Validators.required, Validators.email]],
    //     phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    //     password: ['', [Validators.required, Validators.minLength(6)]],        
    //     confirm_password:['', Validators.required]
    //   }, {
    //     validator: MustMatch('password', 'confirm_password')
    // })

    }


    get f() { return this.signupForm.controls; }

    getLogin(e:any){

      this.submitted = false;



      this.signupForm = this.fb.group({
        name: [null],
        email: [null],
        phone: [null]
      })

      let v= e.target.value;
  
      if(v=='phone'){
  
        this.signupForm = this.fb.group({
          name: ['', Validators.required],
          email: [null],
          phone: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
        })
  
        // $(".email").hide();
        // $(".phone").show();
      }
  
      if(v=='email'){
  
        this.signupForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: [null]
        })
        
        // $(".email").show();
        // $(".phone").hide();
      }
  
    }
  
  

  onSubmit() {

    this.submitted = true;

     // stop here if form is invalid
     if (this.signupForm.invalid) {
      return;
     }else{      
       const signupData={
        name:this.signupForm.value.name,
        email:this.signupForm.value.email,
        phone:this.signupForm.value.phone,
        password:this.signupForm.value.password,
        created_by:this.signupForm.value.name
       };
       this.signupService.signup(signupData).subscribe(
        res=>{ 
          //console.log(res);
          if(res.status==1){             
           //console.log(res.data.id);
            localStorage.setItem('userId',res.data.id);
            this.toastr.success(res.message, 'Success', {
              timeOut: 4000,
              positionClass: 'toast-bottom-right'
            });

            this.router.navigate(['otp']);

          }else{

            let msg  = JSON.parse(res.message); 
              let message='';
             
               if(msg['email']){
                 message += msg['email']+"\n";
               }

               if(msg['phone']){
                 message += msg['phone']+"\n";
               }
                
                this.toastr.error(message, 'Error', {
                  timeOut: 4000,
                  positionClass: 'toast-bottom-right'
                });
            

          }
         
         
  
        }); 


       
     }
   
  }


  ngOnInit(): void {
  }

}
