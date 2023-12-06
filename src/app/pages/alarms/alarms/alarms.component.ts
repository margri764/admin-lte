import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject, debounceTime } from 'rxjs';
import { LanguageApp } from 'src/app/pages/table.languaje'
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css']
})
export class AlarmsComponent implements OnInit {

  @ViewChild('groupSelect') groupSelect! : ElementRef;
  @ViewChild('excluir') excluir! : ElementRef;
  @ViewChild('closebutton') closebutton! : ElementRef;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();


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

   myForm!: FormGroup;
   myFormSearch!: FormGroup;
   submitted : boolean = false;
   bsValue = new Date();
   bsRangeValue!:Date[];
   maxDate = new Date();
   minDate = new Date();
   isHovered: boolean = false;
   isHovered2: boolean = false;
   dtOptions: any  = {};
   groupSelection : boolean = false;
   userSelection : boolean = false;
   user : any | null;
   groups : any []=[];
   selectedGroups : any [] =[];
   nameGroups : any [] =[];
   isChecked : boolean = false;
   exclude : boolean = false;
   frequencySelected : any []=[];
   frequency = [ {id:0, name: 'No mesmo dia'}, {id:1, name: '1 dia antes'}, {id:7, name: '7 dias antes'}, {id:15, name: '15 dias antes'}  ]
   nameFreq : any []=[];




  constructor(
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService,
              private userService : UserService
  ) {

      // Establecer la fecha máxima como 50 años después de la fecha actual
      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);

      // Establecer la fecha mínima como 100 años antes de la fecha actual
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      
      // Inicializar bsRangeValue con la fecha actual y la fecha máxima
      this.bsRangeValue = [this.bsValue, this.maxDate];

      this.dtOptions = { language: LanguageApp.spanish_datatables }

      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
      });   
  
        
   }

ngOnInit(): void {

  this.alarmGroupService.getAllGroups().subscribe(
    ( {success, groups} )=>{
      if(success){
          this.groups = groups
      }
    })


  this.myForm = this.fb.group({
    name:     [ '', [Validators.required] ],
    iduser:  [ null ],
    idgroups:  [ null],
    alarmDate:  [ '', [Validators.required]],
    notifFrequency:  [ null, [Validators.required]],
  });

  
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


onSave(){

  console.log(this.user);


  this.submitted = true;
  this.userSelection = false;
  this.groupSelection = false;

  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return;
  }


  const grupsLength = this.selectedGroups.length;

  if(this.user === null && grupsLength === 0 && !this.isChecked){
    this.userSelection = true;
    this.groupSelection = true;
    alert('Debes seleccionar una opcion: usuario o grupos ');
    return;
  } 
  if(!this.isChecked && grupsLength !== 0 && this.user !== null){
    alert('No puedes seleccionar usuarios y grupos');
    return;
  }else if (this.isChecked && grupsLength !== 0 &&this.user === null) {
    alert('Deebs seleccionar el usuario a excluir');
    return;

  }
  const alarmDate = this.myForm.get('alarmDate')?.value;

  let formattedDate = null;
  let groups : any [] | null= [];

  if(alarmDate !== null && alarmDate !== ''){
    formattedDate = moment(alarmDate).toISOString();
  }

  this.selectedGroups.forEach( (element:any)=>{
    groups?.push(element.idgroup)
  })


  const body = {
      alarmDate: formattedDate,
      idgroups: groups.length > 0 ? groups : null,
      iduser: this.isChecked ? null : this.user.iduser,
      notIncludeUser: this.isChecked ? this.user.iduser : null,
      notifFrequency: this.frequencySelected
  }

  console.log(body); 

  this.alarmGroupService.createAlarm(body).subscribe(
    ( {success} )=>{
      if(success){
        this.closebutton.nativeElement.click();
        alert("Alarma creada corretcame");
      }
    })

}

onSelect(event: any): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.exclude = true;

}


validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
}

removeGroup(nameToRemove: string): void {


  // Filtrar el array para excluir el grupo con el nombre especificado
  // esto es para cuando no seleccione nada o sea q viene del back como edit
  if(this.selectedGroups.length !== 0){
    this.selectedGroups = this.selectedGroups.filter(group => group.name !== nameToRemove);
    this.nameGroups = this.selectedGroups.map(group => group.name);
  }else{
    this.nameGroups = this.nameGroups.filter(name => name !== nameToRemove);
  }
  console.log('selectedGroups',  this.selectedGroups);


}

onSelectGroup( event: any){

  const selectedValue = event.target.value;
  const name= selectedValue.split(',')[0];
  const idgroup = parseInt(selectedValue.split(',')[1], 10);

  this.selectedGroups.push({idgroup, name});
  this.nameGroups.push(name);

  if (this.groupSelect) {
    this.groupSelect.nativeElement.selectedIndex = 0;
  }
 

}


onSelectFreq( event: any){
  const selectedValue = event.target.value;
  let id= selectedValue.split(',')[0];
  id = parseInt(id);
  const name = selectedValue.split(',')[1];
  this.frequencySelected.push(id);
  this.nameFreq.push(name);
}


removeFreq(nameToRemove: string): void {

  console.log(this.frequencySelected);

  if(this.frequencySelected.length !== 0){

    switch (nameToRemove) {
      case "No mesmo dia":
                this.frequencySelected = this.frequencySelected.filter(freq => freq !== 0);
        break;
      case "1 dia antes":
          this.frequencySelected = this.frequencySelected.filter(freq => freq !== 1);
        break;
      case "7 dias antes":
          this.frequencySelected = this.frequencySelected.filter(freq => freq !== 7);
        break;
      case "15 dias antes":
          this.frequencySelected = this.frequencySelected.filter(freq => freq !== 15);
        break;
      
    
    
      default:
        break;
    }
    
    
    this.nameFreq = this.nameFreq.filter(freq => freq !== nameToRemove);

  }else{
    this.nameFreq = this.nameGroups.filter(name => name !== nameToRemove);
  }
  console.log('selectedGroups',  this.frequencySelected);


}



toggleHover(isHovered: boolean): void {
  this.isHovered = isHovered;
}

toggleHover2(isHovered2: boolean): void {
  this.isHovered2 = isHovered2;
}

resetForm(){
  this.myForm.reset();
  this.selectedGroups = [];
  this.nameGroups = [];
  this.suggested = [];
  this.myFormSearch.get('itemSearch')?.setValue('');
}

 // search
   
 close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  this.myFormSearch.get('itemSearch')?.setValue('');
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
  this.userService.searchUser(value)
  .subscribe ( ( {users} )=>{
    if(users.length === 0){
        this.spinner = false;
        this.myForm.get('itemSearch')?.setValue('');
    }else{
      this.suggested = users.splice(0,3);
      this.spinner = false;

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

selectUser( user:any ){
this.myForm.get('itemSearch')?.setValue(user.Nome_Completo);
this.user = user;

}
}
