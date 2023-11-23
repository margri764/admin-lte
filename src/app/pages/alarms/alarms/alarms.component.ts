import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageApp } from 'src/app/pages/table.languaje'

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css']
})
export class AlarmsComponent implements OnInit {

   myForm!: FormGroup;
   submitted : boolean = false;
   bsValue = new Date();
   bsRangeValue!:Date[];
   maxDate = new Date();
   minDate = new Date();
   isHovered: boolean = false;
   isHovered2: boolean = false;
   dtOptions: any  = {};


  constructor(
              private fb : FormBuilder
  ) {

      // Establecer la fecha máxima como 50 años después de la fecha actual
      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);

      // Establecer la fecha mínima como 100 años antes de la fecha actual
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      
      // Inicializar bsRangeValue con la fecha actual y la fecha máxima
      this.bsRangeValue = [this.bsValue, this.maxDate];

      this.dtOptions = { language: LanguageApp.spanish_datatables }
        
   }
user:any;
  ngOnInit(): void {

    this.myForm = this.fb.group({
      reminder:     [ '', [Validators.required] ],
      user:  [ '', [Validators.required]],
      birthday:  [ '', [Validators.required]],
      alarmDate:  [ '', [Validators.required]],
      reminderLeadTime:  [ '', [Validators.required]],

    });
  
  }

  onUserBlur() {
    this.user = this.myForm.get('user')?.value;
  }

  register(){
    this.submitted = true;
    console.log(this.myForm.value); 
    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

  }


  toggleHover(isHovered: boolean): void {
    this.isHovered = isHovered;
  }

  toggleHover2(isHovered2: boolean): void {
    this.isHovered2 = isHovered2;
  }

  validField( field: string ) {
    // return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
    const control = this.myForm.controls[field];

    // Verificar si el control existe antes de acceder a sus propiedades
    return control && control.errors && control.touched;
}


}
