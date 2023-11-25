import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.models';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import * as moment from 'moment';

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
              private authService : AuthService
  ) {

      // Establecer la fecha máxima como 50 años después de la fecha actual
      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);

      // Establecer la fecha mínima como 100 años antes de la fecha actual
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      
      // Inicializar bsRangeValue con la fecha actual y la fecha máxima
      this.bsRangeValue = [this.bsValue, this.maxDate];
        
   }

  ngOnInit(): void {

    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      lastName:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      birthday:  [ '', [Validators.required]],
      phone:  [ '', [Validators.required]],
      headquarter:  [ '', [Validators.required]],
      headquarterCity:  [ '', [Validators.required]],
      headquarterCountry:  [ '', [Validators.required]],
    });
    

  }

  register(){
    this.submitted = true;
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }
    
    const birthday = this.myForm.get('birthday')?.value;

    const birthdayFormatted = moment(birthday).format('YYYY-MM-DD');
    
    const body = {
      ...this.myForm.value,
      birthday: birthdayFormatted
    }
    this.isLoading = true;

    this.authService.signUp(body).subscribe( 
      ( {success} )=>{
          if(success){
              this.isLoading = false;
              this.succesSignup = true;
          }
    })

  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}


}
