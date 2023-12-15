import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import 'bootstrap-switch';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user/user.service';
import * as moment from 'moment';
import { User } from 'src/app/shared/models/user.models';
import { Subject, debounceTime, delay } from 'rxjs';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit{

  @ViewChild('link') link!: ElementRef;

    // start search
    @Output() onDebounce: EventEmitter<string> = new EventEmitter();
    @Output() onEnter   : EventEmitter<string> = new EventEmitter();
    debouncer: Subject<string> = new Subject();
    myFormSearch!: FormGroup;
    success:any;
     // start search

    itemSearch : string = '';
    mostrarSugerencias: boolean = false;
    sugested : string= "";
    suggested : any[] = [];
    spinner : boolean = false;
    fade : boolean = false;
    search : boolean = true;
    product  : any[] = [];
    clients : any []=[];
    arrClient : any []=[];
    clientFound : any = null;
    isClientFound : boolean = false;
    labelNoFinded : boolean = false;
    phone : boolean = false;
    // end search

    myForm! : FormGroup;
    ordem :any[] = ["Primeira","Segunda" ];
    bsValue = new Date();
    bsRangeValue!:Date[];
    maxDate = new Date();
    minDate = new Date();
    isLoading : boolean = false;
    showSuccess : boolean = false;
    showLabelNoRole : boolean = false;
    roleSelected : boolean = false;

    dtTrigger: Subject<any> = new Subject();
    userCongregatio : any = null ;
    pathImg : string = '';
    loadindCongregatio : boolean = false;
    isLinkedToCongregatio : boolean = false;
    user! : User;
    readonlyFields: { [key: string]: boolean } = {};
    @ViewChild('closebutton') closebutton! : ElementRef;
    disableOrdem:boolean = false;
    linkCongregatio:any = 0;



  
    constructor(
                private fb : FormBuilder,
                private userService : UserService,
                private errorService : ErrorService,
                private congregatioService : CongregatioService,
                private localeService: BsLocaleService

    ) {

  (screen.width <= 800) ? this.phone = true : this.phone = false;


      this.myForm = this.fb.group({
        ordem: [ '', [Validators.required] ],
        name:  ['', [Validators.required]],
        lastName:  [ '', [Validators.required]],
        Nome_Completo:  [ '' ],
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

      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
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

      this.myFormSearch.get('itemSearch')?.valueChanges.subscribe(newValue => {
        this.itemSearch = newValue;
  
        if(this.itemSearch !== ''){
           this.teclaPresionada();
        }else{
          this.suggested = [];
          this.spinner= false;
        }
      });
  
      this.debouncer
      .pipe(debounceTime(700))
      .subscribe( valor => {
  
        this.sugerencias(valor);
      });
        
        
    }

    addRole(){
      this.showLabelNoRole = false;
      this.userService.authAddRole$.emit(false);
    }

    onSave(){

     
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
            Data_Nascimento: birthdayFormatted,
            linkCongregatio: this.linkCongregatio,
            Ruta_Imagen: (this.pathImg==='') ? null : this.pathImg
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


  selectUser(user: any){

    console.log(user);

  //  user = { ...user, iduser: this.user.iduser};
   this.userCongregatio = user;
   this.linkCongregatio = 1;
   
   this.pathImg =`https://congregatio.info/${user['Ruta Imagen']}`
 
   //back values references
   const backFullName = user['Nome Completo'];
   const backPhone = user.Telefone1;
   const backBirthday = user['Data Nacimento'];
   const backEmail = user.Email;
   const backNationality = user.Nacionalidade;
   const backActualAddress = user['Residência atual'];
   const backSede = user['Sede onde entrou'];
   const backOrdem = user['Ordem'];
   const backName = " ";
   const backLastName = " ";

   // Definir los campos y sus valores iniciales (cámbialos según tu formulario)
   const fields = [
     { name: 'Nome_Completo', backValue: backFullName },
     { name: 'Telefone1', backValue: backPhone },
     { name: 'Data_Nascimento', backValue: backBirthday },
     { name: 'Email', backValue: backEmail },
     { name: 'Nacionalidade', backValue: backNationality },
     { name: 'Residencia_atual', backValue: backActualAddress },
     { name: 'Nome_da_sede', backValue: backSede },
     { name: 'ordem', backValue: backOrdem },
     { name: 'name', backValue: backName },
     { name: 'lastName', backValue: backLastName },
   ];

   if(backOrdem && backOrdem !== ''){

    this.disableOrdem = true;
   }

   // Iterar sobre los campos
   fields.forEach(field => {
     const formControl = this.myForm.get(field.name);
 
     if (formControl instanceof FormControl) {
       if (field.backValue !== null && field.backValue !== undefined && field.backValue !== '') {
         formControl.setValue(field.backValue);
 
         this.readonlyFields[field.name] = true;
       } else {
         this.readonlyFields[field.name] = false;
       }
     }
   });

   
       this.suggested = [];
       this.myFormSearch.get('itemSearch')?.setValue('');
       setTimeout(()=>{
         // asi cierro el modal
         this.closebutton.nativeElement.click();
       },1)


  }


// search

close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  // this.noMatches = false;
  this.clientFound= null;
  this.isClientFound = false;
  }

  teclaPresionada(){
// this.noMatches = false;
this.debouncer.next( this.itemSearch );  
  };

  sugerencias(value : string){
  this.spinner = true;
  this.itemSearch = value;
  this.mostrarSugerencias = true;  
  // this.loadindCongregatio = true;
  this.congregatioService.searchUserCongregatio(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.spinner = false;
        this.myForm.get('itemSearch')?.setValue('');
    }else{
      // this.loadindCongregatio = false;
      this.suggested = users;
    }
    }
  )
  }

  Search( item: any ){
    setTimeout(()=>{
      this.mostrarSugerencias = true;
      this.spinner = false;
      this.fade = false;
      this.clientFound = item;
      this.isClientFound = true;
      this.myForm.get('itemSearch')?.setValue('');
      this.suggested = [];
      // this.noMatches = false;
    },500)
  }
// search
    
  
  

    
     
  }