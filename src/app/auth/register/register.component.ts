import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(
              private fb : FormBuilder
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
      firstName:     [ '', [Validators.required] ],
      lastName:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      birthday:  [ '', [Validators.required]],
      phone:  [ '', [Validators.required]],
      headquartersName:  [ '', [Validators.required]],
      city:  [ '', [Validators.required]],
      country:  [ '', [Validators.required]],
    });
    

  }

  register(){
    this.submitted = true;
    console.log(this.myForm.value); 
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    alert(JSON.stringify(this.myForm.value))
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}


}
