import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})


export class EditUserComponent implements OnInit {

  // start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

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

  constructor(
                private activatedRoute : ActivatedRoute,
                private authService : AuthService,
                private userService : UserService,
                private fb : FormBuilder,
                private congregatioService : CongregatioService
) { 

        this.activatedRoute.params.subscribe(
        ({id})=>{ this.getUserById(id) });

        this.myFormSearch = this.fb.group({
          itemSearch:  [ '',  ],
        });   

}


  ngOnInit(): void {

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
      phone:  [ '', [Validators.required]],
      birthday:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      nationality:  [ '', [Validators.required]],
      actualAddress:  [ '', [Validators.required]],
      headquarterCountry:  [ '', [Validators.required]],
      headquarterCity:  [ '', [Validators.required]],
      headquarterName:  [ '', [Validators.required]],
    });


    $("input[data-bootstrap-switch]").each(function() {
      $(this).bootstrapSwitch('state',  $(this).prop('checked'));
    });

    }

    onSave(){

      console.log(this.myForm.value);
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

    getUserById( id:string ){

      this.isLoading = false;
      this.userService.getUserById( id ).subscribe(
        ( {success, user} )=>{
          if(success){
            this.user = user;
            this.initialForm();
            this.getDocByUserId(user.iduser);
            this.isLoading = true;

          }
        })
    }

fileNameBack : string = '';

    onView( doc:any ){

      console.log(doc);
      this.selectedPdfBack = doc.filePath;
      this.fileNameBack = 'Teste 1';
    }

    getDocByUserId( id:any ){

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
      this.myForm = this.fb.group({
        ordem: [ this.user?.headquarterName, [Validators.required] ],
        name:  [this.user?.name, [Validators.required]],
        lastName:  [ this.user?.lastName, [Validators.required]],
        phone:  [ this.user?.phone, [Validators.required]],
        birthday:  [ this.user?.birthday, [Validators.required]],
        email:  [ this.user?.email, [Validators.required]],
        nationality:  [ this.user?.country, [Validators.required]],
        actualAddress:  [ this.user?.actualAddress, [Validators.required]],
        headquarterCountry:  [ this.user?.headquarterCountry, [Validators.required]],
        headquarterCity:  [ this.user?.headquarterCity, [Validators.required]],
        headquarterName:  [ this.user?.headquarterName, [Validators.required]],
  
    
      });
    }

    handleRoleChange( value:string ){
      console.log(value);

      const email = this.myForm.get('email')?.value;

      this.authService.adminCompleteRegister( email, value ).subscribe
      ( ({success})=>{

      })
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

    closeModal(){

    }
  
    closeToast(){
      this.showSuccess = false;
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
      console.log(users);
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

  selectUser( user:any ){
    console.log(user);
  }
}
