import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { User } from 'src/app/shared/models/user.models';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { CongregatioService } from 'src/app/shared/services/congregatio/congregatio.service';


// TENGO Q VER SI FUNCIONA EN PRODUCCION PROVEER LA RUTA A MI SERVIDOR PARA SERVIR UN PDF

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
@ViewChild('link') tuCheckbox!: ElementRef;
@ViewChild('closebutton') closebutton! : ElementRef;

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
ordem :any[] = ["Diaconos","Pastor" ]
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
fileNameBack : string = '';
lastSetValue: { [key: string]: any } = {};
readonlyFields: { [key: string]: boolean } = {};
wasLinked : boolean = false;
userRole : boolean = false;
role : string = '';
stateLink : boolean = false;
adminRole : boolean = false;
dtOptions: any = {};

userCongregatio : any;
pathImg : string = 'assets/no-image.jpg'




  constructor(
                private activatedRoute : ActivatedRoute,
                private authService : AuthService,
                private userService : UserService,
                private fb : FormBuilder,
                private congregatioService : CongregatioService,
                private cdr: ChangeDetectorRef
) { 

    this.activatedRoute.params.subscribe(
    ({id})=>{ this.getUserById(id) });

    this.myFormSearch = this.fb.group({
      itemSearch:  [ '',  ],
    });   

}


  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers', // Otras opciones de configuración...
    };

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
      active: ['']
    });

  
    }

    onSave(){

      // esto es por si alguien se olvida de linkear despues de seleccionar el user de la BD congregatio
       if(this.wasLinked && !this.stateLink){
        this.showLabelLinked = true;
        return
       } 

       if(this.user.role === ''){
        
       }
      //  ordem: this.user?.headquarterName,
      //  name:  this.user?.name,
      //  lastName: this.user?.lastName,
      //  fullName: [''],
      //  phone: this.user?.phone,
      //  birthday: this.user?.birthday,
      //  email:   this.user?.email,
      //  nationality: this.user?.country,
      //  actualAddress: this.user?.actualAddress,
      //  headquarterCountry: this.user?.headquarterCountry,
      //  headquarterCity: this.user?.headquarterCity,
      //  headquarterName: this.user?.headquarterName,
      //  linkCongregatio: link,
      //  active: this.user.active


      const body : User = {
        ...this.myForm.value,
        // iduser: , 
        // name: ,
        // lastName: ,
        // fullName: ,
        // email: ,
        // birthday: , 
        // headquarterName:,
        // headquarterCity: ,
        // headquarterCountry: ,
        // phone: ,
        // ordem: ,
        // validateEmail: ,
        // password: ,
        // status: ,
        // role: ,
        // country: ,
        // actualAddress: ,
        // linkCongregatio: ,
        // active: ,
        // img : ,
        // history : ,
        // semCapuzManager : ,
        // semCapuzDate : ,
        // capuzManager : ,
        // capuzDate? : ,
        // capuz? : ,
        // semCapuz? : ,
        

      }

    alert(JSON.stringify(body));

  }

    activeAccount( active:any){

      this.isLoading = true;

      const email = this.myForm.get('email')?.value;

      this.authService.activeAccount( email, active ).subscribe
      ( ({success})=>{
        if(success){
          this.showSuccess = true,
          (active === "1") ? this.msg = 'Usúario ativado com sucesso' : this.msg = 'Usúario desativado com sucesso'; 
          setTimeout( ()=>{ this.getUserById( this.user.iduser ); this.isLoading = false;  }, 1000);
          
        }

       })   
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

    // no pude lograr q ande asi-----------------------------------------------------------
    //con esta funcion traigo los documentos q el usuario tiene en BD
    readAndShowPDFFromBack(fileContents: any[]): void {

      this.backFiles = fileContents;
    
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

    onViewClick( name:string, index: number): void {

      if(this.pdfSrcList[index]){
        setTimeout( ()=>{
            this.selectedPdfSrc = this.pdfSrcList[index];
            this.selectedFile = this.files[index];
            this.fileName = name;
          }, 200)
      }


      //    if(this.arrDocument[index]){
      //   setTimeout( ()=>{
      //       this.selectedPdfSrc = this.arrDocument[index];
      //       console.log(  this.selectedPdfSrc);
      //       this.selectedFile = this.files[index];
      //       this.fileName = name;
      //     }, 200)
      // }
      
    }
isLinkedToCongregatio : boolean = false;

    getUserById( id:any ){

      this.isLoading = false;
      this.userService.getUserById( id ).subscribe(
        ( {success, user} )=>{
          if(success){
            this.user = user;
            this.initialForm();
            this.getDocByUserId(user.iduser);
            this.pathImg = user.img;
            (user.linkCongregatio === 1) ? this.isLinkedToCongregatio = true : this.isLinkedToCongregatio = false; 


          }
        })
    }

    onView( doc:any ){
      this.selectedPdfBack = doc.filePath;
      this.fileNameBack = 'Teste 1';
    }

    getDocByUserId( id:any ){
      console.log(id);
      this.isLoading = true;
      this.userService.getDocByUserId(id).subscribe(
      ( {document} )=>{
        this.arrDocument = document;
        this.isLoading = false;
  

      });


    }

    downloadPdf(files: any) {
      if (files && files.filePath) {
        // Obtén el nombre del archivo desde la ruta
        const fileName = files.filePath.split('\\').pop() || files.name;
    
        // Crea un enlace temporal
        const link = document.createElement('a');
        
        // Configura el enlace con la ruta del archivo
        link.href = files.filePath;
    
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
            this.msg = "Documento enviado com sucesso!!."
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
      
      (this.user.linkCongregatio === 1) ? link = true : link = false;
      
      this.myForm.patchValue({
        ordem: this.user?.ordem,
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

    handleRoleChange( value:string ){

      this.role = value;

     }

    continue(){
        this.userService.authDelDocument$.emit( true );
    }

    deleteDocById( doc:any){

      this.userService.authDelDocument$.subscribe( (emmited)=>{ 
        if(emmited){

          this.isLoading = true;
          this.userService.deleteDocById( doc.iddocument ).subscribe(
            ( {success} )=>{
                if(success){
                  this.msg = "Documento removido com sucesso";
                  this.getDocByUserId( this.user.iduser );
                  this.isLoading = false;
                }
            })
        } 
      })
     
    }
  
    closeToast(){
      this.showSuccess = false;
      this.showLabelLinked = false;
      this.msg = '';
    }

    // search
   
    close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  this.myForm.get('itemSearch')?.setValue('');
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
    this.congregatioService.searchUserCongregatio(value)
    .subscribe ( ( {users} )=>{
      if(users.length === 0){
          this.spinner = false;
          this.myForm.get('itemSearch')?.setValue('');
      }else{
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



   selectUser(user: any){

    this.pathImg =`https://congregatio.info/${user['Ruta Imagen']}`
  
    //back values references
    const backNome = user.Nome;
    const backFullName = user['Nome Completo']
    const backPhone = user.Telefone1
    const backBirthday = user['Data Nacimento']
    const backEmail = user.Email
    const backNationality = user.Nacionalidade
    const backActualAddress = user['Residência atual']
    const backHeadquarterName = user['Sede onde entrou']
  
    // Definir los campos y sus valores iniciales (cámbialos según tu formulario)
    const fields = [
      { name: 'nome', backValue: backNome },
      { name: 'fullName', backValue: backFullName },
      { name: 'phone', backValue: backPhone },
      { name: 'birthday', backValue: backBirthday },
      { name: 'email', backValue: backEmail },
      { name: 'nationality', backValue: backNationality },
      { name: 'actualAddress', backValue: backActualAddress },
      { name: 'headquarterName', backValue: backHeadquarterName }
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
    this.user = {
        ...user,
         history: user['Histórico Sedes'],
         capuzManager: user['Encarregado Com Capuz'],
         capuzDate: user['Data Hábito Com Capuz'],
         semCapuzManager: user['Encarregado Sem Capuz'],
         semCapuzDate: user['Data Hábito Sem Capuz'],
         semCapuz: user['Hábito sem capuz (s/n)'],
         capuz: user['Hábito com capuz (s/n)'],
         
        }
    
        this.suggested = [];
        this.myFormSearch.get('itemSearch')?.setValue('');
        setTimeout(()=>{
          // asi cierro el modal
          this.closebutton.nativeElement.click();
        },1)

        console.log(this.user);

   }

  

   ngAfterViewInit() {
  
    // $("input[data-bootstrap-switch]").each(function() {
    //   $(this).bootstrapSwitch('state',  $(this).prop('checked'));
    // });
  
    // Inicializar Bootstrap Switch
    $(this.tuCheckbox.nativeElement).bootstrapSwitch();
  
    // Suscribirte al evento switchChange del Bootstrap Switch
    $(this.tuCheckbox.nativeElement).on('switchChange.bootstrapSwitch', (event: any, state: any) => {
      console.log('Checkbox changed. Checked:', state);
      this.stateLink = state;
      if(this.wasLinked && state){
          this.showLabelLinked = false;
          console.log(this.showLabelLinked);
      }
      (!state) ? this.isLinkedToCongregatio = false : this.isLinkedToCongregatio = true;
    
  
    });

    
   }
  
   private actualizarEstadoSwitch() {
    let link = null;
  
    (this.user.linkCongregatio === 1) ? link = true : link = false;
    
    $("input[data-bootstrap-switch]").bootstrapSwitch('state', link);
        
  
   }
}

  