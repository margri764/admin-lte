import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject, debounceTime } from 'rxjs';
import { LanguageApp } from 'src/app/pages/table.languaje'
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css']
})
export class AlarmsComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('groupSelect') groupSelect! : ElementRef;
  @ViewChild('excluir') excluir! : ElementRef;
  @ViewChild('closebutton') closebutton! : ElementRef;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;


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
   isHovered3: boolean = false;
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject();
   dtTrigger2: Subject<any> = new Subject();
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
   personalAlarms : any []=[];
   grupalAlarms : any []=[];
   pessoal : boolean = false;
   grupal : boolean = false;
   showPessoalAlarms : boolean = false;
   showGrupalAlarms : boolean = true;
   isLoading : boolean = false;
   showSuccess : boolean = false;
   msg : string=''


  constructor(
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService,
              private userService : UserService,
              private localeService: BsLocaleService,

              
  ) {

      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      this.bsRangeValue = [this.bsValue, this.maxDate];
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br')


      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
      });   

      // this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true };
  
        
   }

   ngAfterViewInit(): void {
    // this.dtTrigger.next(null);
    // this.dtTrigger2.next(null);
  }



ngOnInit(): void {

  this.isLoading = true;
  this.initDtOptions();
  this.initGrupalAlarms();
  this.initPersonalAlarms();

  this.alarmGroupService.getAllGroups().subscribe(
    ( {success, groups} )=>{
      if(success){
          this.groups = groups;
      }
    });


  this.myForm = this.fb.group({
    name:     [ '', [Validators.required] ],
    iduser:  [ null ],
    idgroups:  [ null],
    alarmDate:  [ '', [Validators.required]],
    notifFrequency:  [ null, [Validators.required]],
    description: ['']
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

initDtOptions(): void {
  this.dtOptions = {
    language: LanguageApp.portuguese_brazil_datatables,
    pagingType: 'full_numbers',
    responsive: true,
  };
}

initPersonalAlarms(){

  this.alarmGroupService.getAllPersonalAlarms().subscribe(
    ( {success, personalAlarms} )=>{
      if(success){
      this.personalAlarms = personalAlarms;
      this.dtTrigger2.next(null);
      this.isLoading = false;
      }
    })  

}

initGrupalAlarms(){
  this.alarmGroupService.getAllGrupalAlarms().subscribe(
    ( {success, groupAlarms} )=>{
      if(success){
      this.grupalAlarms = groupAlarms;
      this.dtTrigger.next(null);
      this.isLoading = false;
      }
    })
}


selectPessoalOrGrupal( option:string ){

  if(option === "pessoal"){
    this.pessoal = true;
    this.grupal = false;

  }else if(option === "grupal"){
    this.grupal = true;
    this.pessoal = false;


  }
}


// dtInstance!: DataTables.Api;

// showPessoalAlarmsOrGrupal( alarm : string ){

//    this.dtTrigger.unsubscribe();
//    this.dtTrigger2.unsubscribe();
 
//    if (this.dtElement && this.dtElement.dtInstance) {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       dtInstance.destroy();
//     });
//   }
 
//   switch (alarm) {
//     case 'pessoal':
//                   this.showPessoalAlarms = true;
//                   this.showGrupalAlarms = false;
//                   this.dtTrigger2 = new Subject();
//                   this.initDtOptions();  
                  
//       break;

//     case 'grupal':
//                   this.showGrupalAlarms = true;
//                   this.showPessoalAlarms = false;
//                   this.dtTrigger = new Subject();
//                   this.initDtOptions();  
//     break;
  
//     default:
        
//       break;
//   }

//   if (this.dtElement && this.dtElement.dtInstance) {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//       this.dtInstance = dtInstance;
//     });
//   }
// }


onSave(){

  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return;
  }

  this.submitted = true;
  this.userSelection = false;
  this.groupSelection = false;

  const grupsLength = this.selectedGroups.length;


  const alarmDate = this.myForm.get('alarmDate')?.value;

  let formattedDate = null;
  let groups : any [] | null= [];

  if(alarmDate !== null && alarmDate !== ''){
    formattedDate = moment(alarmDate).toISOString();

  }

  this.selectedGroups.forEach( (element:any)=>{
    groups?.push(element.idgroup)
  })

  console.log(this.isChecked);


  if(this.pessoal){

    
    const body = {
      ...this.myForm.value,
      alarmDate: formattedDate,
      idgroups: groups.length > 0 ? groups : null,
      iduser:  this.user.iduser,
      notifFrequency: this.frequencySelected,
  }

    this.isLoading = true;
    this.showSuccess = false;
    this.alarmGroupService.createPersonalAlarm(body).subscribe(
      ( {success} )=>{
        setTimeout(()=>{ this.isLoading = false },1800)
        if(success){
          setTimeout(()=>{   
            this.closebutton.nativeElement.click();
            this.resetForm();
            this.showSuccess = true;
            this.msg = "Alarme criado com sucesso";
            this.pessoal = false;
            this.grupal = false;
          },1000)
          
        }
      })

  }else if(this.grupal){
        
      const body = {
        ...this.myForm.value,
        alarmDate: formattedDate,
        idgroups: groups.length > 0 ? groups : null,
        iduser: !this.isChecked ? null : this.user.iduser,
        excludedUser: !this.isChecked ? null : this.user.iduser,
        notifFrequency: this.frequencySelected,
    }
    this.isLoading = true;
    this.showSuccess = false;
    this.alarmGroupService.createGrupalAlarm(body).subscribe(
      ( {success} )=>{
        setTimeout(()=>{ this.isLoading = false },1800)
        if(success){
          setTimeout(()=>{   
            this.closebutton.nativeElement.click();
            this.resetForm();
            this.showSuccess = true;
            this.msg = "Alarme criado com sucesso";
            this.pessoal = false;
            this.grupal = false;
          },1000)
          
        }
      })
  }



}


onRemove( alarm:any ){

  let id: any;
  let personal : boolean = false;
  let grupal : boolean = false;

  (!alarm.idalarm || alarm.idalarm === undefined ) ? [id = alarm.idgroupalarm, grupal = true] : [id = alarm.idalarm, personal = true];

  this.alarmGroupService.authDelAlarm$.subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.showSuccess = false;
        this.alarmGroupService.deleteAlarm( id ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700)
            if(success){

                if (grupal) {
                  this.grupalAlarms = this.grupalAlarms.filter(a => a.idgroupalarm !== alarm.idgroupalarm);
                } else if (personal) {
                  this.personalAlarms = this.personalAlarms.filter(a => a.idalarm !== alarm.idalarm);
                }
      
              this.msg = "Alarma eliminada com sucesso."
              this.showSuccess = true;
            }
          })
      }
    })

}

continue( ){
  this.alarmGroupService.authDelAlarm$.emit(true);
}

editPessoalAlarm( alarm:any ){

}

closeToast(){
  this.showSuccess = false;
  this.msg = '';
}

onSelect(event: any): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.exclude = !this.exclude;
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

toggleHover3(isHovered3: boolean): void {
  this.isHovered3 = isHovered3;
}

resetForm(){
  this.myForm.reset();
  this.selectedGroups = [];
  this.nameGroups = [];
  this.nameFreq = [];
  this.suggested = [];
  this.myFormSearch.get('itemSearch')?.setValue('');
  this.selectedGroups = [];
  this.frequencySelected = [];
  this.exclude = false;
  this.isChecked = false;
  this.pessoal = false;
  this.grupal = false;
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

this.myFormSearch.get('itemSearch')?.setValue(user.Nome_Completo);
this.user = user;
this.suggested = [];

}

ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
  this.dtTrigger2.unsubscribe();
}
}
