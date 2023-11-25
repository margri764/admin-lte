import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { saveDataLS, saveDataSS } from 'src/app/shared/storage';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressComponent } from 'src/app/pages/progress/progress.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('closebutton') closebutton! : ElementRef;
  @ViewChild('closeNoVerifiedEmail') closeNoVerifiedEmail! : ElementRef;

  myForm!: FormGroup;
  myForm2!: FormGroup;
  myFormCode!: FormGroup;
  submitted : boolean = false;
  showLogin: boolean = true;
  noVerified : boolean = false;
  isLoading : boolean = false;
  noRole : boolean = false;
  successContactUs : boolean = false;
  isSending : boolean = false;
  successResendPass : boolean = false;


  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private router : Router,
              private errorService : ErrorService,
              private modalService: NgbModal
  ) {
     
   }


  ngOnInit(): void {


    this.errorService.noVerifiedError$.subscribe( (emmited)=>{ if(emmited){  setTimeout(()=>{  this.isLoading = false; this.noVerified = true; },1000)}  })

    // si tiene verficado el email pero falta que se le asigne un role. Muestro Toast cona aviso("Usuário sem função")
    this.errorService.noRoleError$.subscribe( (emmited)=>{ if(emmited){  setTimeout(()=>{  this.isLoading = false; this.noRole = true; },1000)}  })

    this.myForm = this.fb.group({
      email:     [ '', [Validators.required] ],
      password:  [ '', [Validators.required]],
  
    });

    this.myForm2 = this.fb.group({
      fullName:     [ '', [Validators.required] ],
      headquarter:     [ '', [Validators.required] ],
      userEmail:     [ '', [Validators.required] ],
      subject:     [ '', [Validators.required] ],
  
    });

    this.myFormCode = this.fb.group({
      code:     [ '', [Validators.required] ],
  
    });

  }

  login(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const email = this.myForm.get('email')?.value;
    const password = this.myForm.get('password')?.value;
    this.isLoading = true;
    this.authService.login( email, password ).subscribe(
      ({token})=>{
        if(token){
                
          saveDataLS('logged', true);
          // if(this.myForm.get('toLStorage')?.value === true){
          //       }else{
          //         saveDataSS('logged', true);
          //       }

                this.isLoading = false;
                this.router.navigateByUrl('dashboard');}
              });

    // this.router.navigateByUrl('/dashboard')
    
  }

  // usario no verificado, toast con reenvio de email con password
  reSendEmailPassword(){
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

//entre em contato con nosotros
  contactUs(){
    this.isSending= true;
    this.authService.contactUs(this.myForm2.value).subscribe( 
      ({success})=>{
        if(success){

          setTimeout(()=>{
            // asi cierro el modal
            this.closebutton.nativeElement.click();
          },1000)

          setTimeout(()=>{
            this.successContactUs = true;
          },1800)
         
          setTimeout(() => {
            this.successContactUs = false;
          }, 5200);
        }

      })


  }

  //reinicio el boolea por si se cancela el toast
  closeToast(){
    this.noRole = false;
   }

   validField(field: string) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
  }
  

}