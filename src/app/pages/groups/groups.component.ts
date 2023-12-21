import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, delay, take, takeUntil } from 'rxjs';
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { LanguageApp } from '../table.languaje';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {

  @ViewChild('closebutton') closebutton! : ElementRef;
  @ViewChild('closebutton2') closebutton2! : ElementRef;

  @Input() user: any;


  groups : any[]=[];
  isLoading : boolean = false;
  myForm!: FormGroup;
  myFormEdit!: FormGroup;
  showSuccess : boolean = false;
  showSuccessCreateGroup : boolean = false;
  msg : string = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dtElement!: DataTableDirective;
  dtElement2!: DataTableDirective;
  isDtInitialized:boolean = false;
  isDtInitialized2:boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();
  tempId= null;
  usersGroup : any []=[];
  selectedGroup = {name: '', length: 0};
  phone : boolean = false;
  show : boolean = false;
  groupID : any;
  




  constructor(
              private errorService : ErrorService,
              private fb : FormBuilder,
              private alarmGroupService : AlarmGroupService,
    
              ) 

  {


    this.myForm = this.fb.group({
      name:     [ '', [Validators.required] ],
      description:  [ '', [Validators.required]],
    });

    this.myFormEdit = this.fb.group({
      editName:     [ '' ],
      editDescription:  [ ''],
    });



    (screen.width <= 800) ? this.phone = true : this.phone = false;
   }



  ngOnInit(): void {

    this.getInitialGroups();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true }


    
  }



getUsersGroup( group:any ){

  this.alarmGroupService.getUsersFromGroup(group.idgroup)
  .subscribe(
    ( {success, users} )=>{
      if(success){
        this.usersGroup = users;
        this.selectedGroup = {name:group.name, length: users.length};
        this.groupID = group.idgroup;


        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger2.next(null);
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger2.next(null);
        }
      }
    })
}


onSave(){

  this.isLoading = true;
  this.showSuccessCreateGroup = false;
  this.alarmGroupService.createGroup( this.myForm.value ).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ this.isLoading = false; },400);
        this.closebutton.nativeElement.click();
        this.msg = 'Grupo criado corretamente'
        this.showSuccessCreateGroup = true;
        this.getInitialGroups();

      }
    })
}


editGroup( group:any ){
  console.log(group);

  
    this.myFormEdit.patchValue({
      editName: group.name,
      editDescription: group.description,
    });

    this.tempId = group.idgroup
  
 
}

saveEdition(  ){

  this.isLoading = true;
  this.showSuccessCreateGroup = false;
  

  const name = this.myFormEdit.get("editName")?.value;
  const description = this.myFormEdit.get("editDescription")?.value;
  
  const body = { name , description }
  
  this.alarmGroupService.editGroup( this.tempId, body).subscribe(
    ( {success} )=>{
      if(success){
        setTimeout(()=>{ this.isLoading = false; },400);
        this.closebutton2.nativeElement.click();
        this.msg = 'Grupo editado corretamente'
        this.showSuccessCreateGroup = true;
        this.getInitialGroups();

      }
    })

}


validField( field: string ) {
  const control = this.myForm.controls[field];
  return control && control.errors && control.touched;
}


validFieldEdit( field: string ) {
  const control = this.myFormEdit.controls[field];
  return control && control.errors && control.touched;
}

getInitialGroups(){


  this.alarmGroupService.getAllGroups().subscribe(
    ( {success, groups} )=>{
      console.log(groups);
      if(success){
        this.groups = groups;
        this.dtTrigger.next(null);
        setTimeout(()=>{ this.isLoading = false }, 700)
      }
    })
}

onRemove( group:any ){


  this.alarmGroupService.authDelGroup$.subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.showSuccess = false;
        this.alarmGroupService.deleteGroup( group.idgroup ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700)
            if(success){

              if (this.dtTrigger) {
                this.dtTrigger.complete();
              }
              this.dtTrigger = new Subject();
              
              this.getInitialGroups();
              this.msg = "Grupo eliminado com sucesso."
              this.showSuccess = true;
            }
          })
      }
    })

}

removeUserFromGroup( group:any ){


  this.alarmGroupService.authDelUserGroup$.pipe(take(1)).subscribe(
    (auth)=>{
      if(auth){
        this.isLoading = true;
        this.alarmGroupService.deleteUserFromGroup( group.idusersgroups ).subscribe(
          ( {success} )=>{
            setTimeout(()=>{ this.isLoading = false },700)
            if(success){

                this.usersGroup = this.usersGroup .filter(a => a.idusersgroups !== group.idusersgroups);
            

              
            }
          })
      }
    })

}

continue( ){
  this.alarmGroupService.authDelGroup$.emit(true);
}

continueUserDel( ){
  this.alarmGroupService.authDelUserGroup$.emit(true);
}

closeToast(){
  this.showSuccess = false;
}

selectUser( user:any ){
  this.show = true;
 this.user = user;
}



ngOnDestroy(): void {
  // if (this.dtTrigger) {
  //   this.dtTrigger.unsubscribe();
  //   this.dtTrigger.complete();
  // }

  // if (this.dtTrigger2) {
  //   this.dtTrigger2.unsubscribe();
  //   this.dtTrigger2.complete();
  // }

  // if (this.dtElement && this.dtElement.dtInstance) {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.destroy();
  //   });
  // }


}





}
