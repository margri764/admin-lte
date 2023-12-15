import { ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { saveDataLS, saveDataSS } from 'src/app/shared/storage';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { Subject, delay, takeUntil, takeWhile, tap } from 'rxjs';
import * as $ from 'jquery';
import { SessionService } from 'src/app/shared/services/session/session.service';
import { ImageUploadService } from 'src/app/shared/services/ImageUpload/image-upload.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('closeModal') closeModal! : ElementRef;
  @ViewChild('openModal') openModal! : ElementRef;
  @ViewChild('closeNoVerifiedEmail') closeNoVerifiedEmail! : ElementRef;

  myForm!: FormGroup;
  myForm2!: FormGroup;
  myFormCode!: FormGroup;
  myFormResendPass!: FormGroup;
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
  successResendVerify : boolean = false;
  phone : boolean = false;
  isDivVisible : boolean = false;
  position : boolean = false;
  sendingAuth : boolean = false;

  // timer
  private destroy$ = new Subject<void>();
  codeTimeRemaining!: number;

  arrBackground : any []=[]

  backgroundImage = '';
  // backgroundImage = 'url(\'../../../assets/background-1.jpg\')';
  
  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private router : Router,
              private errorService : ErrorService,
              private sessionService : SessionService,
              private ngZone: NgZone,
              private imageUploadService : ImageUploadService,
              private cdr: ChangeDetectorRef
              
  )
  
  {


    (screen.width <= 800) ? this.phone = true : this.phone = false;
     
   }


   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit(): void {
    this.getInitBackground();
  


    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

    this.errorService.status400VerifyError$.pipe(delay(1000)).subscribe( (emmited)=>{ if(emmited){ this.isLoading = false; this.noVerified = true; }  })

    // si tiene verficado el email pero falta que se le asigne un role. Muestro Toast cona aviso("Usuário sem função")
    this.errorService.noRoleError$.subscribe( (emmited)=>{ if(emmited){  setTimeout(()=>{  this.isLoading = false; this.noRole = true; },1000)}  })


    this.myForm = this.fb.group({
      email:     [ '', [Validators.required] ],
      password:  [ '', [Validators.required]],
  
    });

    this.myForm2 = this.fb.group({
      fullName: [ '', [Validators.required] ],
      headquarter: [ '', [Validators.required] ],
      userEmail: [ '', [Validators.required] ],
      subject: [ '', [Validators.required] ],
    });

    
    this.myFormResendPass = this.fb.group({
       resendEmail:  [ '', [Validators.required] ],
  
    });

    this.myFormCode = this.fb.group({
      code:     [ '', [Validators.required] ],
  
    });

    this.myFormResend = this.fb.group({
      resendEmail:     [ '', [Validators.required] ],
  
    });


  }


  changeBackground(): void {
    var fondoAleatorio =  this.arrBackground[Math.floor(Math.random() * this.arrBackground.length)];
    this.backgroundImage = fondoAleatorio.filePath;
    this.cdr.detectChanges();
  }


  getInitBackground(){
    this.isLoading = true;
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/documents/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          this.changeBackground()
          setTimeout(()=>{ this.isLoading= false },700)
          
        }
      })
  }

  login(){

   this.changeModalsStates(),
   this.errorService.close$.next(true);
   this.errorService.close$.next(false);

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const email = this.myForm.get('email')?.value;
    const password = this.myForm.get('password')?.value;
    this.isLoading = true;
    this.authService.login( email, password ).subscribe(
      ({success, firstlogin})=>{

        if(success && firstlogin && firstlogin === "true"){
          saveDataLS('logged', true);
          setTimeout(()=>{ 
              this.sendingAuth = false;
              this.closeModal.nativeElement.click();
              this.router.navigateByUrl('dashboard');
            },1700)
                
        }else if(success && firstlogin === "false"){
          setTimeout(()=>{ 
            this.isLoading = false;
            this.openDoubleAuthModal(); 
           },1200)
        }
        });
  }

  doubleAuth(){
    
    const code = this.myFormCode.get('code')?.value;
    const email = this.myForm.get('email')?.value;
    const body = { code, email };
    
    if ( this.myForm.invalid ) {
      this.myFormCode.markAllAsTouched();
      return;
    }

    this.sendingAuth = true;
    this.authService.doubleAuth( body ).subscribe(
      ({success})=>{
        if(success){

                saveDataLS('logged', true);
                setTimeout(()=>{ 
                    this.sendingAuth = false;
                    this.closeModal.nativeElement.click();
                    this.router.navigateByUrl('dashboard');
                  },1700)
                }
              });

  }

  resendCode(){

    this.errorService.close$.next(true);
    this.errorService.close$.next(false);
 
     if ( this.myForm.invalid ) {
       this.myForm.markAllAsTouched();
       return;
     }
 
     const email = this.myForm.get('email')?.value;
     const password = this.myForm.get('password')?.value;
     this.sendingAuth = true;
     this.authService.login( email, password ).subscribe(
       ({success})=>{
 
         if(success ){
           setTimeout(()=>{ 
               this.sendingAuth = false;
               this.sessionService.startCodeTimer();
               this.getTimerCode();
               },1700)
         }
         });

  }

  openDoubleAuthModal() {
    this.openModal.nativeElement.click();
    this.sessionService.startCodeTimer();
    setTimeout(()=>{ this.getTimerCode() },500)
    
  }


  getTimerCode(){

    this.sessionService.getRemainigTimeCode()
    .pipe(
      tap((res) => {
        this.ngZone.run(() => {
          console.log('codeTimeRemaining:', this.codeTimeRemaining, res);
          this.codeTimeRemaining = res;
          // if(res === 0){

          // }
        });
      }),
      takeWhile(timeRemaining => timeRemaining > 0),
      takeUntil(this.destroy$))
      .subscribe((timeRemaining: number) => {
      this.codeTimeRemaining = timeRemaining;
      
      if(timeRemaining === 0){
      this.sessionService.startCodeTimer();
  
      }
      
    });

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
            this.successResendVerify = true 
            this.isLoading = false; 
            this.noVerified = false;
            this.successResendPass = false;
            this.showResendPass = false;
          },700);
        }
      })
  }

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
    this.position = !this.position
  }

  openToastResend(){
    this.showResendPass = true;
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

    if ( this.myForm2.invalid ) {
      this.myForm2.markAllAsTouched();
      return;
    }
    this.isSending= true;
    this.authService.contactUs(this.myForm2.value).subscribe( 
      ({success})=>{
        if(success){
          this.isSending= false;
          this.isDivVisible = false;
          this.position = false;
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

  validField2(field: string) {
    const control = this.myForm2.get(field);
    return control && control.errors && control.touched;
  }

  validFieldCode(field: string) {
    const control = this.myFormCode.get(field);
    return control && control.errors && control.touched;
  }

  
  validFieldResend(field: string) {
    const control = this.myFormResend.get(field);
    return control && control.errors && control.touched;
  }
  
  

}