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
      name:     [ '', [Validators.required] ],
      lastName:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      birthday:  [ '', [Validators.required]],
      phone:  [ '', [Validators.required]],
      headquarterName:  [ '', [Validators.required]],
      headquarterCity:  [ '', [Validators.required]],
      headquarterCountry:  [ '', [Validators.required]],
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
    
    const birthday = this.myForm.get('birthday')?.value;

    const birthdayFormatted = moment(birthday).format('YYYY-MM-DD');
    
    const body : User = {
      ...this.myForm.value,
      birthday: birthdayFormatted
    }
    this.isLoading = true;

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
