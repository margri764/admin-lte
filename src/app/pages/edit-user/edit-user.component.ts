import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { User } from 'src/app/shared/models/user.models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, delay } from 'rxjs';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';
import * as moment from 'moment';
import { AlarmGroupService } from 'src/app/shared/services/alarmGroup/alarm-group.service';
import { LanguageApp } from '../table.languaje';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';





interface CustomFile extends File {
  previewUrl?: string;
  downloadLink?: string;
}

interface Event {
  date: string;
  description: string;
}


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})


export class EditUserComponent implements OnInit, AfterViewInit  {

// start search
@Output() onDebounce: EventEmitter<string> = new EventEmitter();
@Output() onEnter   : EventEmitter<string> = new EventEmitter();
debouncer: Subject<string> = new Subject();
@ViewChild('link') link!: ElementRef;
@ViewChild('closebutton') closebutton! : ElementRef;
@ViewChild('groupSelect') groupSelect! : ElementRef;

myForm! : FormGroup;
myFormSearch! : FormGroup;
countryForm! : FormGroup;
files: File [] = [];
backFiles: any[] = [];
pdfSrc :any;
selectedPdfSrc: any = null;
pdfSrcList: any[] = [];
pdfSrcBackList: any[] = [];
loadingPdf: boolean = false;
selectedFile: CustomFile | null = null;
success: any;
fileName: string = '';
user! : User;
arrDocument : any []=[];
showSuccess : boolean = false;
msg:string = '';
isLoading : boolean = false;
askDelDocument : boolean = false;
ordem :any[] = ["Primeira","Segunda" ]
default: string = '';
selectedPdfBack : any;

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

showLabelLinked : boolean = false;
showSuccessDelDocument : boolean = false;
showSuccessDelUser : boolean = false;
fileNameBack : string = '';
lastSetValue: { [key: string]: any } = {};
readonlyFields: { [key: string]: boolean } = {};
wasLinked : boolean = false;
userRole : boolean = false;
role : string = '';
stateLink : boolean = false;
adminRole : boolean = false;

dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();

userCongregatio : any = null ;
pathImg : string = 'assets/no-image.jpg';
loadindCongregatio : boolean = false;
isLinkedToCongregatio : boolean = false;

bsValue = new Date();
bsRangeValue!:Date[];
maxDate = new Date();
minDate = new Date();
groups : any []=[];
selectedGroups : any []=[];
nameGroups : any []=[];
personalAlarms : any []=[];
isChecked = false;
idUser : any;
disableOrdem : boolean = false;
simpleCodeSelected : boolean = false;



  constructor(
                private activatedRoute : ActivatedRoute,
                private authService : AuthService,
                private userService : UserService,
                private fb : FormBuilder,
                private congregatioService : CongregatioService,
                private errorService : ErrorService,
                private alarmGroupService : AlarmGroupService,
                private localeService: BsLocaleService,
                private router : Router,
                private sanitizer: DomSanitizer
                ) 
                
{ 

  this.activatedRoute.params.subscribe(
    ({id})=>{ this.getUserById(id) });
    
    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   
    
    (screen.width <= 800) ? this.phone = true : this.phone = false;
    
    this.dtOptions = { language: LanguageApp.portuguese_brazil_datatables,  pagingType: 'full_numbers', responsive:true }
}

  ngOnInit(): void {



    this.maxDate.setFullYear(this.bsValue.getFullYear() + 50);
    this.minDate.setFullYear(this.bsValue.getFullYear() - 100);
    this.bsRangeValue = [this.bsValue, this.maxDate];
    this.bsRangeValue = [this.bsValue, this.maxDate];
    defineLocale('pt-br', ptBrLocale);
    this.localeService.use('pt-br');

    this.alarmGroupService.getAllGroups().subscribe(
      ( {success, groups} )=>{
        if(success){
            this.groups = groups
        }
      })

    this.errorService.closeIsLoading$.pipe(delay(100)).subscribe(emitted => emitted && (this.isLoading = false));


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
      linkCongregatio: [ false],
      active: [''],
      simpleCode: [''],
    });

  }


  showDocPreview(fileInfo: any): void {
   
  }
  

  getUsersGroups( id:any ){
    this.alarmGroupService.getGroupByUserId(id).subscribe( 
      ( {success, groups} )=>{
         if(success){
          groups.forEach((item:any)=>{ this.nameGroups.push(item.name)})
          this.selectedGroups = groups;
          console.log( this.selectedGroups);
         }
      } )
  }

  removeGroup(nameToRemove: string): void {
    console.log('Nombre a remover:', nameToRemove);
    console.log('selectedGroups',  this.selectedGroups);
    console.log('nameGroups',   this.nameGroups);
  
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

    // if(this.selectedGroups.length !== 0){
    //   this.selectedGroups =  this.selectedGroups.filter(group => group.name !== nameToRemove);
    //   this.nameGroups = this.selectedGroups.map(group => group.name);
    // }else{
    //   this.nameGroups = this.nameGroups.filter(name => name !== nameToRemove);
    // }

    this.selectedGroups.push({idgroup, name});
    this.nameGroups.push(name);
    console.log(this.selectedGroups);
    if (this.groupSelect) {
      this.groupSelect.nativeElement.selectedIndex = 0;
    }
   

  }

  getUserById( id:any ){

    this.isLoading = false;
    this.userService.getUserById( id ).subscribe(
      ( {success, user} )=>{
        if(success){
          this.user = user;
          this.initialForm();
          this.getUsersGroups(id);
          this.getDocByUserId(user.iduser);
          this.getAlarmByUser(user.iduser);
          if(user.simpleCode === 1){
            this.simpleCodeSelected = true;
          }

          this.idUser = id;
          if(user.Ruta_Imagen !== '' && user.Ruta_Imagen !== null ){
            this.pathImg = user.Ruta_Imagen;
          }
          (user.linkCongregatio === 1) ? this.isLinkedToCongregatio = true : this.isLinkedToCongregatio = false; 


        }
      })
  }

  onSave(){

      // esto es por si alguien se olvida de linkear despues de seleccionar el user de la BD congregatio
       if(this.wasLinked && !this.stateLink){
        this.showLabelLinked = true;
        return
       } 

       let body = null;
       this.showSuccess = false;

       //esto es para la primera vez q lo linkeo, xq la segunda vez ya esta linqueado pero userCongregatio no existe ya q viene del back
       //y es una edicion simple
       if(this.isLinkedToCongregatio && this.userCongregatio){
        body = {...this.userCongregatio};
        body = {...body, groups: [...this.selectedGroups]}

        console.log(body);

        this.userService.editUserCongregatio(this.user.iduser, body).subscribe(
          ( {success} )=>{
              setTimeout(()=>{ this.isLoading = false },1000)
            if(success){
              this.showSuccess = true;
              this.msg = 'Usúario editado com sucesso'; 
            }
          })

       }else{

        body = this.myForm.value;
        this.isLoading = true;

        const Data_Nascimento = this.myForm.get('Data_Nascimento')?.value;

        let birthdayFormatted = null;
        if(Data_Nascimento !== null && Data_Nascimento !== ''){
          birthdayFormatted = moment(Data_Nascimento).format('YYYY-MM-DD');
        }else{
          birthdayFormatted = null;
        }
        
        body = {
          ...body,
          Data_Nascimento:birthdayFormatted,
          role : this.role,
          groups: this.selectedGroups
        }

        console.log(body);
        //  alert(JSON.stringify(body) );
        
        this.userService.editUserById(this.user.iduser, body).subscribe(
          ( {success} )=>{
              setTimeout(()=>{ this.isLoading = false },1000)
            if(success){
              this.showSuccess = true;
              this.msg = 'Usúario editado com sucesso'; 

            }
          })
       }
    
  }

  getAlarmByUser( id:any){

    this.alarmGroupService.getAlarmByUser(id).subscribe(
      ( {success, alarm} )=>{
        if(success){
          this.personalAlarms = alarm;
          this.dtTrigger.next(null);

        }
      })
  }

  onRemoveAlarm( alarm:any ){

    const id = alarm.idalarm;
    console.log(id);
  
    this.alarmGroupService.authDelAlarm$.subscribe(
      (auth)=>{
        if(auth){
          this.isLoading = true;
          this.showSuccess = false;
          this.alarmGroupService.deleteAlarm( id ).subscribe(
            ( {success} )=>{
              setTimeout(()=>{ this.isLoading = false },700)
              if(success){
                this.personalAlarms = this.personalAlarms.filter(a => a.idalarm !== alarm.idalarm);
                this.msg = "Alarma eliminada com sucesso."
                this.showSuccess = true;
              }
            })
        }
      })
  
  }

  continueDelAlarm(){
    this.alarmGroupService.authDelAlarm$.emit(true);
  }
  

    onSelect(event: any): void {

      const addedFiles: File[] = event.addedFiles;
  
      for (const file of addedFiles) {
        this.readAndShowPDF(file);
        this.files.push(file);
      }
      console.log(this.files);

    }
  
    onRemove(file: File): void {

      this.userService.authDelDocument$.subscribe( (emmited)=>{ 
        if(emmited){
            const index = this.files.indexOf(file);
            if (index !== -1) {
              this.files.splice(index, 1);
        
              if (this.selectedPdfSrc === this.pdfSrcList[index]) {
                this.selectedPdfSrc = null;
              }
            }
          }
        })
    }

    readAndShowPDF(file: any): void {

      console.log(file);

      const reader = new FileReader();
      this.loadingPdf = true;
    
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const downloadLink = base64Data;
        
        this.pdfSrcList.push({ preview: base64Data, downloadLink });
        this.loadingPdf = false;
      };
    
      reader.readAsDataURL(file);

      console.log(reader);
    }

    readAndShowPDFBack(file: any): void {

      console.log(file);

      const reader = new FileReader();
      this.loadingPdf = true;
    
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const downloadLink = base64Data;
        
        this.pdfSrcList.push({ preview: base64Data, downloadLink });
        this.loadingPdf = false;
      };
    
      reader.readAsDataURL(file);

      console.log(reader);
    }

    fileContentToBuffer(fileContent: any): Uint8Array {
      if (fileContent && fileContent.data && Array.isArray(fileContent.data)) {
        return new Uint8Array(fileContent.data);
      }
      return new Uint8Array();
    }

    //con esta funcion traigo los documentos q el usuario tiene en BD
    readAndShowPDFFromBack(fileContents: any[]): void {

      this.backFiles = fileContents;
      console.log('');
    
      fileContents.forEach((fileContent) => {
        
        const buffer = this.fileBackContentToBuffer(fileContent);
        const blob = new Blob([buffer], { type: 'application/pdf' });
    
        const reader = new FileReader();
        // this.loadingPdf = true;
    
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          const downloadLink = base64Data;
    
          this.pdfSrcBackList.push({ preview: base64Data, downloadLink });
          this.loadingPdf = false;
        };
    
        reader.readAsDataURL(blob);
      });
    }
    
    fileBackContentToBuffer(fileContent: any): Uint8Array {
      if ( Array.isArray(fileContent.hash.data)) {
        console.log('ddd');
        return new Uint8Array(fileContent.hash.data);
      }
   
      return new Uint8Array();
    }
    // no pude lograr q ande asi-----------------------------------------------------------

    onViewClick(name: string, index: number): void {
      if (this.pdfSrcList[index]) {
        console.log(name, index);
        
        const reader = new FileReader();
        
        reader.onloadend = () => {
          // Obtén los datos Base64
          const base64Data = reader.result as string;
          
          // Asigna los datos Base64 al src del pdf-viewer
          this.selectedPdfSrc = base64Data;
          
          this.selectedFile = this.files[index];
          this.fileName = name;
        };
        
        // Lee el contenido del archivo como datos Base64
        reader.readAsDataURL(this.files[index]);
      }
    }


    // este va en prod
      
    onView( doc:any ){

      const fileName = doc.filePath.split('/').pop() ;

      console.log(fileName);
        const serverURL = 'https://arcanjosaorafael.org/documents/'; 
      
        this.selectedPdfBack = `${serverURL}${fileName}`;
        console.log( this.selectedPdfBack);
        this.fileNameBack = doc.originalName;

    }

    thumbailsPdf(doc:any ){

      const fileName = doc.filePath.split('/').pop() ;

      const serverURL = 'https://arcanjosaorafael.org/documents/'; 
      
      console.log( `${serverURL}${fileName}`);
       return  `${serverURL}${fileName}`;
    }
    

    getDocByUserId( id:any ){
      this.isLoading = true;
      this.userService.getDocByUserId(id).subscribe(
      ( {document} )=>{
        this.isLoading = false;
        this.arrDocument = document;
        this.arrDocument.forEach((doc) => {
          this.thumbailsPdf(doc);
        });

        console.log(this.arrDocument);
  

      });


    }

    downloadPdf(files: any) {
      if (files && files.filePath) {
        // Obtén el nombre del archivo desde la ruta
        const fileName = files.filePath.split('/').pop() || files.name;
    
        // Configura la ruta del servidor en producción
        const serverURL = 'https://arcanjosaorafael.org/documents/'; // Reemplaza con la URL de tu servidor
    
        // Crea un enlace temporal
        const link = document.createElement('a');
    
        // Configura el enlace con la ruta completa del archivo en producción
        link.href = `${serverURL}${fileName}`;
    
        // Configura la propiedad de descarga con el nombre del archivo original
        link.download = fileName;
    
        // Abre el enlace en una nueva pestaña
        link.target = '_blank';
    
        // Simula un clic en el enlace para iniciar la descarga
        link.click();
      }
    }
    
    uploadDocument( file:any ){

      this.userService.uploadDocument(this.user.iduser, file).subscribe(
        ( {success} )=>{
          if(success){
            this.getDocByUserId( this.user.iduser );
            this.showSuccess = true;
            this.msg = "Operação de envio bem-sucedida!"
            this.files = [];
          }
        })
    }

    validField(field: string) {
      const control = this.myForm.get(field);
      return control && control.errors && control.touched;
    }

    initialForm(){

      let link = null;
      
      (this.user.linkCongregatio === 1) ? [ link = true, this.disableOrdem = true ]: link = false;
      
      this.myForm.patchValue({
        ordem: this.user?.Ordem,
        name:  this.user?.name,
        lastName: this.user?.lastName,
        Nome_Completo: [this.user?.Nome_Completo,],
        Telefone1: this.user?.Telefone1,
        Data_Nascimento: this.user?.Data_Nascimento,
        Email:   this.user?.Email,
        Nacionalidade: this.user?.Nacionalidade,
        Residencia_atual: this.user?.Residencia_atual,
        Pais_da_sede: this.user?.Pais_da_sede,
        Cidade_da_sede: this.user?.Cidade_da_sede,
        Nome_da_sede: this.user?.Nome_da_sede,
        linkCongregatio: link,
        active: this.user.active
      });

       this.actualizarEstadoSwitch();
       this.role = this.user.role;
       if(this.user.role === 'user'){
         this.userRole = true;
       }else if(this.user.role === 'admin'){
          this.adminRole = false;
       }
    }

    getObjectProperties(): { key: string, value: any }[] {
      
      if(this.user){
        return Object.keys(this.user).map(key => ({ key, value: this.user![key as keyof User] }));
      }else if(this.userCongregatio){
        return Object.keys(this.userCongregatio).map(key => ({ key, value: this.userCongregatio[key] }));
      }
      return [{key:'', value:''}]
    }

    handleRoleChange( value:string ){
      this.role = value;
     }

    continue(){
        this.userService.authDelDocument$.emit( true );
    }

    continueDelUser(){
      this.userService.authDelUser$.emit( true );
    }

    deleteUser( ){

      this.userService.authDelUser$.subscribe( (emmited)=>{ 
        if(emmited){
          this.isLoading = true;
          this.showSuccessDelDocument = false;
          this.showSuccessDelUser = false;
          this.userService.deleteUser( this.idUser ).subscribe(
            ( {success} )=>{
                if(success){
                  this.msg = "Us'uario removido com sucesso";
                  this.isLoading = false;
                  this.showSuccess = true;
                  setTimeout(()=>{ this.router.navigateByUrl('dashboard/usuarios')},2700)
                }
            })
        } 
      })
     
    }

    deleteDocById( doc:any){

      
      this.userService.authDelDocument$.subscribe( (emmited)=>{ 
        if(emmited){
          this.isLoading = true;
          this.showSuccessDelDocument = false;
          this.userService.deleteDocById( doc.iddocument ).subscribe(
            ( {success} )=>{
                if(success){
                  this.msg = "Documento removido com sucesso";
                  this.getDocByUserId( this.user.iduser );
                  this.isLoading = false;
                  this.showSuccessDelDocument = true;
                }
            })
        } 
      })
     
    }
  
    closeToast(){
      this.showSuccess = false;
      this.showLabelLinked = false;
      this.showSuccessDelDocument = false;
      this.msg = '';
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
    this.loadindCongregatio = true;
    this.congregatioService.searchUserCongregatio(value)
    .subscribe ( ( {users} )=>{
      if(users.length === 0){
          this.spinner = false;
          this.myForm.get('itemSearch')?.setValue('');
      }else{
        this.loadindCongregatio = false;
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


  activeDeacTive(event: any): void{

    this.isChecked = (event.target as HTMLInputElement).checked;
    this.isLoading = true;
    this.showSuccess = false;
    
    const email = this.myForm.get('Email')?.value;
    let active : any;
    (this.isChecked) ? active = '1' :  active = '0';
    
    this.authService.activeAccount( email, active ).subscribe
    ( ({success})=>{
      if(success){
        this.showSuccess = true,
        (active === "1") ? this.msg = 'Usúario ativado com sucesso' : this.msg = 'Usúario desativado com sucesso'; 
        setTimeout( ()=>{ this.getUserById( this.user.iduser ); this.isLoading = false;  }, 1000);
      }
    
     }) 
  }


  simpleCode(event: any): void{

    this.simpleCodeSelected = (event.target as HTMLInputElement).checked;

    
    const email = this.myForm.get('Email')?.value;
    
    if(!email || email === ''){
      return;
    }
    
    
    const body = {
      email,
      simpleCode: (this.simpleCodeSelected) ? 1 : 0
    }
    console.log(body);


     this.authService.simpleCode(body).subscribe();
    
  }

   selectUser(user: any){

     console.log(user);

    user = { ...user, iduser: this.user.iduser};
    this.userCongregatio = user;
    
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

 

    this.wasLinked = true;


    // this.user = {
    //     ...user,
    //      history: user['Histórico Sedes'],
    //      capuzManager: user['Encarregado Com Capuz'],
    //      capuzDate: user['Data Hábito Com Capuz'],
    //      semCapuzManager: user['Encarregado Sem Capuz'],
    //      semCapuzDate: user['Data Hábito Sem Capuz'],
    //      semCapuz: user['Hábito sem capuz (s/n)'],
    //      capuz: user['Hábito com capuz (s/n)'],
         
    //     }
    
        this.suggested = [];
        this.myFormSearch.get('itemSearch')?.setValue('');
        setTimeout(()=>{
          // asi cierro el modal
          this.closebutton.nativeElement.click();
        },1)


   }

   ngAfterViewInit() {
  
    // $("input[data-bootstrap-switch]").each(function() {
    //   $(this).bootstrapSwitch('state',  $(this).prop('checked'));
    // });
  
    // Inicializar Bootstrap Switch
    $(this.link.nativeElement).bootstrapSwitch();
  
    // Suscribirte al evento switchChange del Bootstrap Switch
    $(this.link.nativeElement).on('switchChange.bootstrapSwitch', (event: any, state: any) => {
      console.log('Checkbox changed. Checked:', state);
      this.stateLink = state;
      if(this.wasLinked && state){
          this.showLabelLinked = false;
      }

      if(!state) {
         this.isLinkedToCongregatio = false;
       }else{ 
        this.isLinkedToCongregatio = true;
      }
  
    });

    
   }
  
   private actualizarEstadoSwitch() {
    let link = null;
  
    (this.user.linkCongregatio === 1) ? link = true : link = false;
    
    $("input[data-bootstrap-switch]").bootstrapSwitch('state', link);
        
  
   }
}

  