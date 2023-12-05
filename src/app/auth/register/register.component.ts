import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.models';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import * as moment from 'moment';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { delay } from 'rxjs';

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

  constructor(
              private fb : FormBuilder,
              private authService : AuthService,
              private errorService : ErrorService
  ) {

      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      this.bsRangeValue = [this.bsValue, this.maxDate];
        
   }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    
    this.myForm = this.fb.group({
      name:     [ 'Fernando', [Validators.required] ],
      lastName:  [ 'Griotti', [Validators.required]],
      email:  [ 'fgriotti747@alumnos.iua.edu.ar', [Validators.required]],
      Data_Nascimento:  [ '2003-10-10', [Validators.required]],
      Telefone1:  [ '453454rt', [Validators.required]],
      Nome_da_sede:  [ 'aaa', [Validators.required]],
      Cidade_da_sede:  [ 'bbb', [Validators.required]],
      Pais_da_sede:  [ 'ccc', [Validators.required]],
    });

    // this.myForm = this.fb.group({
    //   name:     [ 'marcelo', [Validators.required] ],
    //   lastName:  [ 'griotti', [Validators.required]],
    //   email:  [ 'margri764@gmail.com', [Validators.required]],
    //   birthday:  [ '2023-11-11', [Validators.required]],
    //   phone:  [ 'dfdf', [Validators.required]],
    //   headquarter:  [ 'aa', [Validators.required]],
    //   headquarterCity:  [ 'bb', [Validators.required]],
    //   headquarterCountry:  [ 'cc', [Validators.required]],
    // });
    
    

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
          }
    })

  }

  validField( field: string ) {
    const control = this.myForm.get(field);
    return control && control.errors && control.touched;
    // return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}


}
