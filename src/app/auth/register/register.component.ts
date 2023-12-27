import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.models';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { delay } from 'rxjs';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ValidateService } from 'src/app/shared/services/validate/validate.service';
import { ImageUploadService } from 'src/app/shared/services/ImageUpload/image-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  myForm!: FormGroup;
  submitted : boolean = false;
  bsValue = new Date();
  bsRangeValue!:Date[];
  maxDate = new Date();
  minDate = new Date();
  succesSignup : boolean = false;
  isLoading : boolean = false;
  arrBackground : any []=[];
  backgroundImage : string = '';

  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private errorService : ErrorService,
              private localeService: BsLocaleService,
              private validatorService : ValidateService,
              private imageUploadService : ImageUploadService,
              private router : Router
  ) {

      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      this.bsRangeValue = [this.bsValue, this.maxDate];
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');
    
 
  

   }

  ngOnInit(): void {

    this.getInitBackground();

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      lastName:  [ '', [Validators.required]],
      email:     [ '', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      Data_Nascimento:  [ '', [Validators.required]],
      Telefone1:  [ '', [Validators.required]],
      Cidade_da_sede:  [ '', [Validators.required]],
      Nome_da_sede:  [ '', [Validators.required]],
      Pais_da_sede:  [ '', [Validators.required]],
    });

   
    
    

  }

  register(){

    this.errorService.close$.next(true);
    this.errorService.close$.next(false);
    
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }
    
    const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;
    let birthdayFormatted = null;
    if(Data_Nascimento !== null && Data_Nascimento !== ''){
      birthdayFormatted = moment(Data_Nascimento).format('YYYY-MM-DD');
    }else{
      birthdayFormatted = null;
    }
    
    

    
    const body : User = {
      ...this.myForm.value,
      Data_Nascimento: birthdayFormatted
    }
    this.isLoading = true;

    console.log(body);
    this.authService.signUp(body).subscribe( 
      ( {success} )=>{
          if(success){
            setTimeout(()=>{ this.isLoading = false; },700)
              this.succesSignup = true;
              this.myForm.reset();
              setTimeout(()=>{ this.router.navigateByUrl('/login') },1900)
          }
    })

  }

  getInitBackground(){
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
      
            const serverURL = 'https://arcanjosaorafael.org/backgrounds/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          this.changeBackground()
          
        }
      })
    }

    changeBackground(): void {
      var fondoAleatorio =  this.arrBackground[Math.floor(Math.random() * this.arrBackground.length)];
      this.backgroundImage = fondoAleatorio.filePath;
      this.backgroundImage = this.backgroundImage.replace(/\(/g, '%28').replace(/\)/g, '%29');
    }
  
  

  validField( field: string ) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
}


}
