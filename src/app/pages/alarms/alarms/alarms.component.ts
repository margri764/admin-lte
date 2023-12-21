import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Subject, debounceTime, delay } from 'rxjs';
import { LanguageApp } from 'src/app/pages/table.languaje'
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DataTableDirective } from 'angular-datatables';
import { Alarm, AlarmGrupal } from 'src/app/shared/interfaces/alarm.interface';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { log } from 'console';


@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.component.html',
  styleUrls: ['./alarms.component.css']
})
export class AlarmsComponent implements OnInit, OnDestroy, AfterViewInit{

  @ViewChild('groupSelect') groupSelect! : ElementRef;
  @ViewChild('excluir') excluir! : ElementRef;
  @ViewChild('closebutton') closebutton! : ElementRef;
  @ViewChild('closebuttonEdit') closebuttonEdit! : ElementRef;
  @ViewChild('closebuttonEditGrupal') closebuttonEditGrupal! : ElementRef;
  @Input() userViewModal: any;

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();



  // start search
  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  showSuggested : boolean = false;
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
   myFormEditPersAlarm!: FormGroup;
   myFormEditGrupalAlarm!: FormGroup;
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
   isDtInitialized1:boolean = false;
   isDtInitialized2:boolean = false;
   dtElement1!: DataTableDirective;
   dtElement2!: DataTableDirective;
 
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
   show : boolean = false;
   msg : string=''


  constructor(
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService,
              private userService : UserService,
              private localeService: BsLocaleService,
              private errorService : ErrorService
              
  ) {

      this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
      this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
      this.bsRangeValue = [this.bsValue, this.maxDate];
      defineLocale('pt-br', ptBrLocale);
      this.localeService.use('pt-br');

      this.myFormSearch = this.fb.group({
        itemSearch:  [ '',  ],
      });   


   }

   ngAfterViewInit(): void {
    // this.dtTrigger.next(null);
    // this.dtTrigger2.next(null);
  }



ngOnInit(): void {

  this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

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
    description: ['',[Validators.required]],
  });

  this.myFormEditPersAlarm = this.fb.group({
    idalarm:[],
    personalName:     [ '', [Validators.required] ],
    alarmPersonalDate:  [ '', [Validators.required] ],
    notifPersonalFrequency:  [ null ],
    descriptionPersonal: [ '', [Validators.required] ],
  });

  
  this.myFormEditGrupalAlarm = this.fb.group({
    idgroupalarm: [],
    grupalName:     [ '', [Validators.required] ],
    alarmGrupalDate:  [ '', [Validators.required] ],
    notifGrupalFrequency:  [ null ],
    descriptionGrupal: [ '', [Validators.required] ],
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

  this.isLoading = true;

  this.alarmGroupService.getAllPersonalAlarms().subscribe(
    ( {success, personalAlarms} )=>{

      if(success){
     
        setTimeout(()=>{ this.isLoading = false },1200)

        this.personalAlarms = personalAlarms;
        if (this.isDtInitialized2) {
            this.dtElement2.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger2.next(null);
          });
        } else {
          this.isDtInitialized2 = true
          this.dtTrigger2.next(null);
        }
        }
    })  

}

initGrupalAlarms(){

  this.isLoading = true;
  
  this.alarmGroupService.getAllGrupalAlarms().subscribe(
    ( {success, groupAlarms} )=>{

      if(success){
      
        this.grupalAlarms = groupAlarms;

        setTimeout(()=>{ this.isLoading = false },1200)

        if(this.isDtInitialized1) {
          this.dtElement1.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(null);
          });
        } else {
          this.isDtInitialized1 = true
          this.dtTrigger.next(null);
        }
      }
    })
}

selectPessoalOrGrupal( option:string ){

  if(option === "pessoal"){
    this.pessoal = true;
    this.grupal = false;
    this.frequencySelected = [];
    this.nameFreq = [];
    this.suggested = [];
    this.user = {};
    this.myForm.reset();
    this.myFormSearch.reset();
    this.isChecked = false;
    this.mostrarSugerencias = false;
    this.showSuggested = false;
    this.exclude = false;
    this.nameGroups = [];
    this.groupSelection = false;

  }else if(option === "grupal"){
    this.grupal = true;
    this.pessoal = false;
    this.frequencySelected = [];
    this.nameFreq = [];
    this.suggested = [];
    this.user = {};
    this.myForm.reset();
    this.myFormSearch.reset();
    this.isChecked = false;
    this.mostrarSugerencias = false;
    this.showSuggested = false;
    this.exclude = false;
    this.nameGroups = [];
    this.groupSelection = false;

  }
}

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
            this.initPersonalAlarms();
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
            this.initGrupalAlarms();
            this.pessoal = false;
            this.grupal = false;
            this.isChecked = false;
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

launchPersonalAlarm(alarm: any) {

  this.nameFreq = alarm.notifFrequency.map((day: number) => {
    switch (day) {
      case 0:
              this.frequencySelected.push(0);
        return 'No mesmo dia';
      case 1:
              this.frequencySelected.push(1);
        return '1 dia antes';
      case 7:
              this.frequencySelected.push(7);
        return '7 dias antes';
      case 15:
              this.frequencySelected.push(15);
        return '15 dias antes';
      default:
        return 'Día Desconocido';
    }
  });

    
  this.myFormEditPersAlarm.patchValue({
    personalName: alarm.name,
    alarmPersonalDate: alarm.alarmDate,
    descriptionPersonal: alarm.description,
    idalarm: alarm.idalarm
  });

  this.myFormEditPersAlarm.get('personalName')?.setValidators([Validators.required]);
  this.myFormEditPersAlarm.get('alarmPersonalDate')?.setValidators([Validators.required]);
  this.myFormEditPersAlarm.get('descriptionPersonal')?.setValidators([Validators.required]);
  // this.myFormEditPersAlarm.get('notifPersonalFrequency')?.setValidators([Validators.required]);

}

editPersonalAlarm( ){


  if ( this.myFormEditPersAlarm.invalid ) {
    this.myFormEditPersAlarm.markAllAsTouched();
    return;
  }

  const alarmDate = this.myForm.get('alarmPersonalDate')?.value;

  let formattedDate = '';

  if(alarmDate !== null && alarmDate !== ''){
    formattedDate = moment(alarmDate).toISOString();
  }


  const body : Alarm = {
    name : this.myFormEditPersAlarm.get('personalName')?.value,
    alarmDate : formattedDate,
    notifFrequency : this.frequencySelected,
    description : this.myFormEditPersAlarm.get('descriptionPersonal')?.value,
    idalarm : this.myFormEditPersAlarm.get('idalarm')?.value
  }

  console.log(body);
 
  this.isLoading = true;
  this.showSuccess = false;

  this.alarmGroupService.editPersonalAlarm(body.idalarm, body).subscribe(
    ( {success} )=>{
            if(success){
              setTimeout(()=>{ this.isLoading = false },1700)
              // this.personalAlarms = this.personalAlarms.filter( (item)=>item.idalarm !== body.idalarm);
              this.initPersonalAlarms();
              this.showSuccess = true;
              this.msg = "Alarme editada com sucesso";
              this.resetEdition();

              setTimeout(()=>{
                // asi cierro el modal
                this.closebuttonEdit.nativeElement.click();
              },1)
            }
    })
}

resetEdition(){
  this.pessoal = false;
  this.grupal = false;
  this.frequencySelected = [];
  this.nameFreq = [];
  this.myFormEditPersAlarm.reset();
  this.myFormEditGrupalAlarm.reset();
  this.suggested = [];
  this.isChecked = false;
  this.mostrarSugerencias = false;
  this.selectedGroups = [];
  this.nameGroups = [];

}

unSelectExludedUser( user:any ){
  
  console.log(user.iduser);

  this.suggested = this.suggested.filter( (item)=>item.iduser !== user.iduser)
}

launchGrupalAlarm(alarm: any) {

  console.log(alarm);

  //esto es el user excluido q viene del back
  this.suggested.push(alarm.user);

  if(alarm.user.iduser !== null){
    this.showSuggested = true;
    this.mostrarSugerencias = true;
  }

  // creo el mismo tipo de objeto con el q se trabaja en el new alarm, para eso combino dos prop del back
  const group_names = alarm.group_names;
  const groups_ids = alarm.groups_ids;
  this.selectedGroups = group_names.map((name: any, index: string | number) => ({ idgroup: groups_ids[index], name }));


  this.nameFreq = alarm.notifFrequency.map((day: number) => {
    switch (day) {
      case 0:
              this.frequencySelected.push(0);
        return 'No mesmo dia';
      case 1:
              this.frequencySelected.push(1);
        return '1 dia antes';
      case 7:
              this.frequencySelected.push(7);
        return '7 dias antes';
      case 15:
              this.frequencySelected.push(15);
        return '15 dias antes';
      default:
        return 'Día Desconocido';
    }
  });

  this.nameGroups = alarm.group_names;

    
  this.myFormEditGrupalAlarm.patchValue({
    grupalName: alarm.name,
    alarmGrupalDate: alarm.alarmDate,
    descriptionGrupal: alarm.description,
    idgroupalarm: alarm.idgroupalarm
  });

  this.myFormEditGrupalAlarm.get('grupalName')?.setValidators([Validators.required]);
  this.myFormEditGrupalAlarm.get('alarmGrupalDate')?.setValidators([Validators.required]);
  this.myFormEditGrupalAlarm.get('descriptionGrupal')?.setValidators([Validators.required]);
  // onSelectGroup

}

editGrupalAlarm(){

  
  if ( this.myFormEditGrupalAlarm.invalid ) {
    this.myFormEditGrupalAlarm.markAllAsTouched();
    return;
  }

  const alarmDate = this.myForm.get('alarmGrupalDate')?.value;

  let formattedDate = '';
  let groups : any [] | null= [];

  if(alarmDate !== null && alarmDate !== ''){
    formattedDate = moment(alarmDate).toISOString();
  }
  this.selectedGroups.forEach( (element:any)=>{
    groups?.push(element.idgroup)
  })


  const body : AlarmGrupal = {
    name : this.myFormEditGrupalAlarm.get('grupalName')?.value,
    alarmDate : formattedDate,
    notifFrequency : this.frequencySelected,
    description : this.myFormEditGrupalAlarm.get('descriptionGrupal')?.value,
    idgroupalarm : this.myFormEditGrupalAlarm.get('idgroupalarm')?.value,
    excludedUser: !this.isChecked ? null : this.user.iduser,
    idgroups: groups.length > 0 ? groups : null,
  }

  console.log(body);
  this.isLoading = true;
  this.showSuccess = false;
 
  this.alarmGroupService.editGrupalAlarm(body.idgroupalarm, body).subscribe(
    ( {success} )=>{
            if(success){
              this.initGrupalAlarms();
              setTimeout(()=>{
                 this.isLoading = false; 
                 this.closebuttonEditGrupal.nativeElement.click();
              },1700)

              setTimeout( ()=>{ 
                 this.resetEdition(); 
                 this.msg = "Alarme editada com sucesso";
                 this.showSuccess = true; 
              },2000)
            }
    })

}

activePausePersonalAlarm( alarm:any, action:string ){

  this.alarmGroupService.activePausePersonalAlarm( alarm.idalarm, action).subscribe( 
    ( {success})=>{
          if(success){
            this.initPersonalAlarms();
          }
    } )
}

activePauseGrupalAlarm( alarm:any, action:string ){

  this.alarmGroupService.activePauseGrupalAlarm( alarm.idgroupalarm, action).subscribe( 
    ( {success})=>{
          if(success){
            this.initGrupalAlarms();
          }
    } )
}

closeToast(){
  this.showSuccess = false;
  this.msg = '';
}

onSelect(event: any): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.exclude = !this.exclude;
}

onSelectEdition(event: any): void {
    this.isChecked = (event.target as HTMLInputElement).checked;
    this.exclude = !this.exclude;
}

validField( field: string ) {
    const control = this.myForm.controls[field];
    return control && control.errors && control.touched;
}

validFieldEdit( field: string ) {
  const control = this.myFormEditPersAlarm.controls[field];
  return control && control.errors && control.touched;
}

validFieldEditGrupal( field: string ) {
  const control = this.myFormEditGrupalAlarm.controls[field];
  return control && control.errors && control.touched;
}

removeGroup(nameToRemove: string): void {

  console.log('selectedGroups',  this.selectedGroups);


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

console.log(this.selectedGroups);
  // Verificar si ya existe un grupo con el mismo idgroup
    const existingGroup = this.selectedGroups.find(group => group.idgroup === idgroup);
  
    // Agregar solo si no existe
    if (!existingGroup) {
      this.selectedGroups.push({ idgroup, name });
      this.nameGroups.push(name);
    }

  if (this.groupSelect) {
    this.groupSelect.nativeElement.selectedIndex = 0;
  }
console.log(this.selectedGroups);
 

}

onSelectFreq( event: any){
  const selectedValue = event.target.value;
  let id= selectedValue.split(',')[0];
  id = parseInt(id);
  const name = selectedValue.split(',')[1];

    const existingFreq = this.frequencySelected.find(item => item === id);
   
    if (!existingFreq) {
      this.frequencySelected.push(id);
      this.nameFreq.push(name);
    }

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

resetForm(){
    this.myForm.reset();
    this.selectedGroups = [];
    this.nameGroups = [];
    this.nameFreq = [];
    this.suggested = [];
    this.showSuggested = false;
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
  this.showSuggested = false;
  this.myFormSearch.get('itemSearch')?.setValue('');
  this.clientFound= null;
  this.isClientFound = false;
 }

 teclaPresionada(){
// this.noMatches = false;
    this.debouncer.next( this.itemSearch );  
    this.showSuggested = true;
 };

 sugerencias(value : string){
  // this.spinner = true;
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
this.showSuggested = false;
this.show = true;
this.userViewModal = user;
}

viewUser( user:any ){
  this.show = true;

  this.userViewModal = user;
}

closeModal(){
  this.userViewModal = {};
  this.show = false;
}


ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
  this.dtTrigger2.unsubscribe();
}
}
