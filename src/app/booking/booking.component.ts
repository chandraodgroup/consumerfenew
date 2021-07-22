import { Component, OnInit, Input, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ToastrService} from 'ngx-toastr'
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { FormControl } from '@angular/forms';
import { ExternalLibraryService } from '../util';

import { BookticketService } from '../services/bookticket.service';
import { MakepaymentService } from '../services/makepayment.service';
import { PaymentstatusService } from '../services/paymentstatus.service';



declare let Razorpay: any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})

export class BookingComponent implements OnInit{ 

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
 
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
      ],
    }
  };

  genderArr:any=[];


   public bookForm1: FormGroup;
   public bookForm2: FormGroup;
   public bookForm3: FormGroup;

   submitted1=false;
   submitted2=false;

   bookingdata: any;
   busRecord: any;

   passengerData: any=[];

   bookTicketResponse :any=[];
   MakePaymnetResponse :any=[];

   source:any;
   destination:any;
   source_id:any;
   destination_id:any;
   entdate:any;
   formatentdate:any;

   razorpayResponse: any;
   response: any;
   showModal = false;
   tabclick :any = true;

   total_seat_id:any=[];

  constructor(private ngWizardService: NgWizardService,private fb : FormBuilder,
    private router: Router,private bookticketService:BookticketService,
    private razorpayService: ExternalLibraryService,private cd:  ChangeDetectorRef,
    private toastr: ToastrService,private makepaymentService:MakepaymentService,
    private paymentstatusService: PaymentstatusService
    ) {

    this.source=localStorage.getItem('source');
    this.destination=localStorage.getItem('destination');   
    const entdt:any =localStorage.getItem('entdate'); 

    let dd = new Date(entdt);
    let mnth = ("0" + (dd.getMonth() + 1)).slice(-2);
    let day = ("0" + dd.getDate()).slice(-2);
    let jjj= [dd.getFullYear(), mnth,day].join("-");
    this.entdate = jjj;

    this.source_id=localStorage.getItem('source_id');
    this.destination_id=localStorage.getItem('destination_id'); 

    this.genderArr=[
      {
        'name' : 'Male',
        'value' : 'M'
      },
      {
        'name' : 'Female',
        'value' : 'F'
      },
      {
        'name' : 'Other',
        'value' : 'O'
      }
    ];

    this.bookingdata=localStorage.getItem('bookingdata');
    this.busRecord=localStorage.getItem('busRecord');

    if(this.bookingdata == null && this.busRecord == null){
      this.router.navigate(['/']);
    }else{
      this.bookingdata= JSON.parse(this.bookingdata);
      this.busRecord= JSON.parse(this.busRecord);

      if(this.bookingdata.LowerBerthSeats.length){
        this.total_seat_id =this.total_seat_id.concat(this.bookingdata.LowerBerthSeats);
      }

      if(this.bookingdata.UpperBerthSeats.length){
        this.total_seat_id =this.total_seat_id.concat(this.bookingdata.UpperBerthSeats);
      }

      
      //console.log(this.bookingdata);
      //console.log(this.busRecord);      
    }

    this.bookForm2 = this.fb.group({
      tnc:[null, Validators.required]
    });

    this.bookForm3 = this.fb.group({});


    this.bookForm1 = this.fb.group({
        customerInfo: this.fb.group({          
          email: [null, [Validators.email]],
          phone: [null, [Validators.required,Validators.pattern("^((\\+91-?))?[0-9]{10}$")]],  
          name:[null, Validators.required],
        }),     
        seat_id: [this.total_seat_id],  
        // bookStatus:["1"],
        bookingInfo: this.fb.group({
          bus_id: ["1"],
          source_id: [this.source_id],
          destination_id: [this.destination_id],
          // j_day: ["1"],
          journey_dt: [this.entdate],
          boarding_point: [this.bookingdata.boardingPoint],
          dropping_point: [this.bookingdata.droppingPoint],
          boarding_time: [this.busRecord.departureTime],
          dropping_time: [this.busRecord.arrivalTime],
          origin: ["ODBUS"],
          app_type: ["WEB"],
          typ_id: ["1"],
          created_by: ["Customer"],
          bookingDetail: this.fb.array([]),        
        })
      });

    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;
      for(let i=0;i< this.bookingdata.LowerBerthSeats.length ;i++){
        let seat= this.bookingdata.LowerBerthSeats[i];
         passengerList.push(this.createItem(seat,this.busRecord.seaterPrice)); 
      }  

      for(let i=0;i< this.bookingdata.UpperBerthSeats.length ;i++){
        let seat= this.bookingdata.UpperBerthSeats[i];
         passengerList.push(this.createItem(seat,this.busRecord.sleeperPrice)); 
      }
  
  }

   createItem(seat:any,fare:any): FormGroup{
    return this.fb.group({
      seat_no: [seat], 
      passenger_name: [null, Validators.required],
      passenger_gender: [null, Validators.required],
      passenger_age:  [null, [Validators.required,Validators.pattern("^[0-9]{2}$")]],  
      total_fare: [fare],
      owner_fare: [0],
      created_by: ['Customer']
    });
  }

  get passengerFormGroup() {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;    
    return passengerList;
  }

  getPassengerFormGroup(index:any): FormGroup {
    const bookingInfo = this.bookForm1.controls["bookingInfo"] as FormGroup;
    const passengerList = bookingInfo.get('bookingDetail') as FormArray;
    const formGroup = passengerList.controls[index] as FormGroup;
    return formGroup;
  }

  get f() {     
    return this.bookForm1.controls;
   }

   get GetcustomerInfo():FormGroup{

    const FormGroup = this.bookForm1.get('customerInfo') as FormGroup;
    //const FormControl = ele.controls[type] as FormControl;
   // console.log(FormGroup);
    return FormGroup;

   }


   submitForm2(){

    this.submitted2=true;
    if (this.bookForm2.invalid) {
      return;
     }else{
      ///// call to make paymnet API to get RazorPayment Order ID and Total price
      const paymentParam={
         "transaction_id": this.bookTicketResponse.transaction_id,
         "amount":this.bookingdata.TotalPrice,
      } 

     // console.log(paymentParam);

      this.makepaymentService.getOrderid(paymentParam).subscribe(
        res=>{
        if(res.status==1){
          this.MakePaymnetResponse=res.data;
          
          this.proceed();
        }    
      },
      error => {
        this.toastr.error(error.error.message, 'Error', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });
      }
      );

    }

   }

  
  submitForm1(){

    this.submitted1=true;

    

    if (this.bookForm1.invalid) {
      return;
     }else{
     // $(".loader").show();
      this.passengerData=this.bookForm1.value; 

     // console.log(this.passengerData);

      this.bookticketService.book(this.passengerData).subscribe(
        res=>{
        //console.log(res);

        if(res.status==1){
         // $(".loader").hide();
          this.bookTicketResponse=res.data;
          this.showNextStep();
        }
      },
      error => {

        //$('.loader').hide();

        this.toastr.error(error.error.message, 'Error', {
          timeOut: 4000,
          positionClass: 'toast-bottom-right'
        });
      }
      );

    }

  }

  
  public proceed() {

   const RAZORPAY_OPTIONS :any = {
      "key": this.MakePaymnetResponse.key,
      "amount": this.MakePaymnetResponse.amount,
      "name": "ODBUS PAYMENT",
      "order_id": this.MakePaymnetResponse.razorpay_order_id,
      "description": "",
      "image": "assets/img/odbus-logo.svg",
      "prefill": {
        "name": this.passengerData.customerInfo.name,
        "email": this.passengerData.customerInfo.email,
        "contact": '+91'+this.passengerData.customerInfo.phone,
        "method": ""
      },
      "modal": {},
      "theme": {
        "color": "#d39e00"
      }
    };
   
    RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

    let razorpay = new Razorpay(RAZORPAY_OPTIONS)
    razorpay.open();
  }

 
  razorPaySuccessHandler(res: any) { 

    let bkdt = new Date();
    let bkdt_mnth = ("0" + (bkdt.getMonth() + 1)).slice(-2);
    let bkdt_day = ("0" + bkdt.getDate()).slice(-2);
    let booking_date= [bkdt_day, bkdt_mnth,bkdt.getFullYear()].join("-");
   

    let j_date = new Date(this.entdate);
    let j_mnth = ("0" + (j_date.getMonth() + 1)).slice(-2);
    let j_day = ("0" + j_date.getDate()).slice(-2);
    let journey_date= [j_day,j_mnth,j_date.getFullYear()].join("-");
    
    if(res){

     this.response={

      "transaction_id":this.bookTicketResponse.transaction_id,
      "razorpay_payment_id":res.razorpay_payment_id,
      "razorpay_order_id":res.razorpay_order_id,
      "razorpay_signature":res.razorpay_signature,
      "name":this.passengerData.customerInfo.name,
      "email":this.passengerData.customerInfo.email,    
      "bookingdate":booking_date,
      "journeydate":journey_date,
      "boarding_point":this.bookingdata.boardingPoint,
      "departureTime":this.busRecord.departureTime,
      "dropping_point":this.bookingdata.droppingPoint,
      "arrivalTime":this.busRecord.arrivalTime,
      "seat_id":this.total_seat_id,
      "busname": this.busRecord.busName,
      "busNumber": this.busRecord.busNumber,
      "bustype":this.busRecord.busType,
      "busTypeName":this.busRecord.busTypeName,
      "sittingType":this.busRecord.sittingType,
      "conductor_number":this.busRecord.conductor_number,
      "passengerDetails":this.passengerData.bookingInfo.bookingDetail,
      "totalfare":this.bookingdata.TotalPrice    
    }

    //$('.loader').show();

    this.paymentstatusService.getPaymentStatus(this.response).subscribe(
      res=>{
      if(res.status==1){          
        this.showNextStep();       
        this.tabclick = false;          
        this.toastr.success(res.data, 'Success', {
          positionClass: 'toast-bottom-right'
        }); 

       // $(".loader").delay(5000).fadeOut();      
      }

    },
    error => {
      this.toastr.error(error.error.message, 'Error', {
        timeOut: 4000,
        positionClass: 'toast-bottom-right'
      });
      //$(".loader").hide();
    }
    );

   }
    
  }

  print():void {
    let printContents, popupWin :any='';
    //printContents = $('#print-section').html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          @media print {
            
            
.passenger{
  font-family: lato;
  font-size: 16px;
  font-weight: bold;
  border-radius: 3px;
  opacity: 1;   
  margin-top: 20px; 
}

.passenger-detail{
  font-family: lato;
  font-size: 16px;
  font-weight: bold;
  background: #f8f8f8 0% 0% no-repeat padding-box;
  border: 1px solid #00000026;
  border-radius: 3px;
  opacity: 1; 
}

.padding{
  padding-top: 10px;
  padding-bottom: 10px;

}

.box-padding{
  margin-top: 30px;

}




label ,p{
  padding-top: 10px;
  color: #072C6B;
  font-size: 14px;
}

h5{
  padding-top: 10px;
  color: #072C6B;
  font-weight: bold;
  font-size: 15px;
}

.grey{
  color:#B2ADAD;
  font-size: 14px;
}
.terms{

  font-family: Lato, Regular;
  color:#B2ADAD;
  font-size: 12px;
}

h6{
  color: #072C6B;
  font-family: "Lato";
  font-size: 13px;
  line-height: 25px;
}

label{
  text-transform: capitalize;
}

hr{
  border: 1px solid #efc003;
}

span{
  color:#efc003;
}

.font{
  color:#efc003;
  font-size: 15px;
}
.padding-left{
  left: 15px;
  padding-left: 15px;
}



.fare-detail{
  color: #072C6B;
  font-size: 13px;
}
.proceed{
  width:200px;
}
.img1{
  margin-top: 226px;
  margin-left: 9px;
}

.img2{
  margin-left: 13px;
  height: 95px;
}

.img3{
  margin-left: 9px;
}

.bus{
  height: 38px;
  background: transparent url('../../assets/img/bus.svg') 0% 0% no-repeat padding-box;
  opacity: 1;
  margin-top: 35px;
}
.tableclass{
  width:100%;
  font-family: Open Sans, Semibold;
}


.tableclass2{
  width:100%;
  font-family: Robotto, Medium;
  margin-top: 20px;
}



thead{
  color: #B2ADAD;
}

tbody{
  color: #072C6B;
  font-size: 13px;
  font-family: Open Sans, Semibold;
}
.roboto{
  font-size: 14px;
  font-weight: 400;
}

.make-payment{
  
  width: 300px;
  height: 75px;
  background: var(--unnamed-color-efc003) 0% 0% no-repeat padding-box;
  background: #EFC003 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 1;
  padding-top: 20px;
  margin-bottom: 27px;
  margin-bottom: 15px;
  
}

.payment_box{
  top: 15px;
}

.print_btn{
  display:none
}

h4{
  font-size: 20px;
  font-weight: bold;
  color: #072C6B;
  text-align: left;
  font-family: Lato;
 
}

.payment-btn{
  padding-left:45px;
}
.small_tag {
  font-size: 11px;
  margin-left: 6px;
  font-weight: 600;
  line-height: 0;
}

.option > img{

  width: 24px;
  margin: 1px 10px 5px 10px;

}

.option > span{

 color: #072C6B;
 font-size: 12px;

}

input[type="radio"]:checked {

  background: transparent url('../../assets/img/Group631.svg') 0% 0% no-repeat padding-box;

  
}

.option > label{
    margin: 0px 34px;
}

.input-group-append {
  margin-left: -20px !important;
}
.continue{
  margin: 0px 12px;
  font-size: 10px;
  padding: 0px 28px;
  border-radius: 0px;
  color: #072c6b;
  font-family: 'Lato';
}

.text-field{
  width: 85px;
  padding: 3px 14px;
  color: #072c6b;
}

::placeholder{
  font-size: 12px;
  color:#072C6B
}

.grey_tag{

  margin: 0px 20px;
  font-size: 11px;
  line-height: 0px;

}

.print-ticket{
  margin: 10px 40px;
  font-family: Open Sans, Bold;
}

.smile{
    width: 25px;
    margin: 4px 7px 8px;
}

.print{
    font-weight: bold;
}

.paragraph{
    color:#B2ADAD;
    font-size: 13px;
    font-family: Open Sans, Regular;
}

.ng-select .ng-has-value .ng-placeholder {
  font-size: 12px !important;
  font-weight: lighter !important;
}
.ng-select, .ng-select div, .ng-select input, .ng-select span {
  font-size: 12px !important;
  font-weight: lighter !important;
}





          }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  ngOnInit() { 
    this.passengerData=this.bookForm1.value;

    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();

  }
 
  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }
 
  showNextStep(event?: Event) {
    this.ngWizardService.next();
    
  }
 
  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }
 
  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }
 
  stepChanged(args: StepChangedArgs) {
    //console.log(args);
  }
 
  isValidTypeBoolean: boolean = true;
 
  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }
 
  isValidFunctionReturnsObservable(args: StepValidationArgs) {    
    return this.tabclick;
  }

  submit(){
    alert('form submitted');
  }
 


}