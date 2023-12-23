import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { ValidateService } from 'src/app/shared/services/validate/validate.service';

@Component({
  selector: 'app-resend-password',
  templateUrl: './resend-password.component.html',
  styleUrls: ['./resend-password.component.css']
})
export class ResendPasswordComponent implements OnInit {


  myForm!: FormGroup;
  myFormResend!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;
  isLoading : boolean = false;
  isSending : boolean = false;

  noVerified : boolean = false;
  noRole : boolean = false;
  successContactUs : boolean = false;
  successResendPass : boolean = false;
  showResendPass : boolean = false;
  showSuccessResend : boolean = false;
  successResendVerify : boolean = false;


  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private errorService : ErrorService,
              private validatorService : ValidateService,
              private router : Router,
  ) {
     
   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.errorService.status400VerifyError$.pipe(delay(1000)).subscribe( (emmited)=>{ if(emmited){ this.isLoading = false; this.noVerified = true; }  })


    this.myForm = this.fb.group({
      email:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
    });

    this.myFormResend = this.fb.group({
      resendEmail:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)] ],
    });


  }

// usario no verificado, toast con reenvio de email con password
reSendEmailPassword(){


    this.errorService.close$.next(true);
    this.errorService.close$.next(false);

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return
    }
    
    const email = this.myForm.get('email')?.value;
    if(email === undefined || email === '' || email === null){
      return
    }
    this.isLoading = true;
    this.authService.resendPasword(email).subscribe(
      ({success})=>{
        if(success){
          this.isLoading = false;
          this.successResendPass = true;
          this.noVerified = false;
        }
      })

}

// por si pide una reenvio de contraseña y todavia no esta verficado  
verifyEmail(){
  
  this.errorService.close$.next(true);
  this.errorService.close$.next(false);

  if ( this.myFormResend.invalid ) {
    this.myFormResend.markAllAsTouched();
    return
  }
  this.isLoading = true
  const email = this.myFormResend.get("resendEmail")?.value;
    
  this.authService.verifyEmail(email).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ 
          this.isLoading = false; 
          this.successResendVerify = true 
          this.noVerified = false;
          this.successResendPass = false;
          this.showResendPass = false;
        },700);
      }
    })
  }



  openToastResend(){
    this.showResendPass = true;
  }



  //reinicio el boolea por si se cancela el toast
  closeToast(){
    this.noRole = false;
   }

   changeModalsStates(){
      this.noVerified = false;
      this.noRole = false;
      this.successContactUs = false;
      this.successResendPass = false;
      this.showResendPass = false;
   }

   validField(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }

  validFieldResend(field: string) {
    const control = this.myFormResend.get(field);
    return control && control.errors && control.touched;
  }
  
  

}