import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{

  @ViewChild('link') link!: ElementRef;
  myForm! : FormGroup;
  ordem :any[] = ["Primeira","Segunda" ];

  
    constructor(
                private fb : FormBuilder,
                private userService : UserService
    ) {

      this.myForm = this.fb.group({
        ordem: [ '', [Validators.required] ],
        name:  ['', [Validators.required]],
        lastName:  [ '', [Validators.required]],
        Nome_Completo:  [ '', [Validators.required]],
        Telefone1:  [ '', [Validators.required]],
        Data_Nascimento:  [ '', [Validators.required]],
        Email:  [ '', [Validators.required]],
        Nacionalidade:  [ '', [Validators.required]],
        Residencia_atual:  [ '', [Validators.required]],
        Pais_da_sede:  [ '', [Validators.required]],
        Cidade_da_sede:  [ '', [Validators.required]],
        Nome_da_sede:  [ '', [Validators.required]],
        role: ['']
      });
     }
  
    ngOnInit(): void {
  
  
   
    }

    onSave(){
      alert(JSON.stringify(this.myForm.value));
      this.userService.createUser(this.myForm.value).subscribe(
        ( {success} )=>{
          alert("usuario creado corerctamente")
        })
    }
  
    
    handleRoleChange( value:string ){

      this.myForm.get('role')?.setValue(value)

     }

    
     
  }