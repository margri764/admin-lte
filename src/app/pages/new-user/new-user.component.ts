import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'bootstrap-switch';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';
import * as moment from 'moment';
import { User } from 'src/app/shared/models/user.models';
import { delay } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{

  @ViewChild('link') link!: ElementRef;
  myForm! : FormGroup;
  ordem :any[] = ["Primeira","Segunda" ];
  bsValue = new Date();
  bsRangeValue!:Date[];
  maxDate = new Date();
  minDate = new Date();
  isLoading : boolean = false;
  phone : boolean = false;
  showSuccess : boolean = false;
  showLabelNoRole : boolean = false;
  roleSelected : boolean = false;


  
    constructor(
                private fb : FormBuilder,
                private userService : UserService,
                private errorService : ErrorService,
              private localeService: BsLocaleService

    ) {

  (screen.width <= 800) ? this.phone = true : this.phone = false;


      this.myForm = this.fb.group({
        ordem: [ '', [Validators.required] ],
        name:  ['', [Validators.required]],
        lastName:  [ '', [Validators.required]],
        Telefone1:  [ '', [Validators.required]],
        Data_Nascimento:  [ '', [Validators.required] ],
        Email:  [ '', [Validators.required]],
        Nacionalidade:  [ '', [Validators.required] ],
        Residencia_atual:  [ '', [Validators.required] ],
        Pais_da_sede:  [ '', [Validators.required] ],
        Cidade_da_sede:  [ '', [Validators.required] ],
        Nome_da_sede:  [ '', [Validators.required] ],
        role: ['']
      });
     }
  
    ngOnInit(): void {

        

    this.errorService.closeIsLoading$.pipe(delay(700)).subscribe(emitted => emitted && (this.isLoading = false));


      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      this.bsRangeValue = [this.bsValue, this.maxDate];
      this.bsRangeValue = [this.bsValue, this.maxDate];
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');
        
        
    }

    addRole(){
      this.showLabelNoRole = false;
      this.userService.authAddRole$.emit(false);
    }

    onSave(){

      alert(JSON.stringify(this.myForm.value));
     
      if ( this.myForm.invalid ) {
        this.myForm.markAllAsTouched();
        return;
      }

      const role = this.myForm.get('role')?.value;

      if(role === '' || role === undefined){
        this.showLabelNoRole = true;
      }

      if(this.roleSelected){
        this.userService.authAddRole$.emit(true);
      }

      this.userService.authAddRole$.subscribe( (auth)=>{
        if(auth){

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
          this.userService.createUser(body).subscribe(
            ( {success} )=>{
              if( success ){
                setTimeout(()=>{ this.isLoading = false }, 700);
                this.showSuccess = true;
              }
            })

        }else{
          return
        }
      })


         
    }
  
    
    handleRoleChange( value:string ){

      this.myForm.get('role')?.setValue(value);
      const role =    this.myForm.get('role')?.value;
      if(role !== '' || role !== undefined){
        this.roleSelected = true;
      }

     }

     validField( field: string ) {
      const control = this.myForm.get(field);
      return control && control.errors && control.touched;
  }

  closeToast(){
    this.showSuccess = false;
  }

  
  closeToastRole(){
    this.showLabelNoRole = false;
    this.userService.authAddRole$.emit(true);
  }
  
  

    
     
  }