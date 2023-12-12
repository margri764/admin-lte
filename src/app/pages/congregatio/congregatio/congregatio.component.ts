import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, debounceTime, delay } from 'rxjs';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import { LanguageApp } from '../../table.languaje';
import { User } from 'src/app/shared/models/user.models';

@Component({
  selector: 'app-congregatio',
  templateUrl: './congregatio.component.html',
  styleUrls: ['./congregatio.component.css']
})
export class CongregatioComponent implements OnInit {
  
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

  isLoading : boolean = false;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  congregatio : any []=[];
  user! : User;


  constructor(
              private fb : FormBuilder,
              private errorService : ErrorService,
              private congregatioService : CongregatioService
  ) { 

    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   
  }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive: true }


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
    .pipe(debounceTime(1500))
    .subscribe( valor => {

      this.sugerencias(valor);
    });
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

    if (this.dtTrigger) {
      this.dtTrigger.complete();
    }
    this.dtTrigger = new Subject();

    this.spinner = true;
    this.itemSearch = value;
    this.mostrarSugerencias = true;  
    this.isLoading = true;
    this.congregatioService.searchUserCongregatio(value)
    .subscribe ( ( {users} )=>{
      if(users.length === 0){
          this.spinner = false;
          this.myFormSearch.get('itemSearch')?.setValue('');
      }else{
        this.isLoading = false;
        this.congregatio = users;
        // this.dtTrigger.next(null);
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
    this.myFormSearch.get('itemSearch')?.setValue('');
    this.suggested = [];
    // this.noMatches = false;
  },500)
   }
  // search

  getObjectProperties(): { key: string, value: any }[] {
      
    if(this.user){
      return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
    }
    return [{key:'', value:''}]
  }

  selectUserCongregatio( user:any ){

    this.user = user;

  }


}
