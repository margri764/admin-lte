import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { ImageUploadService } from 'src/app/shared/services/ImageUpload/image-upload.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { EditUserComponent } from '../../edit-user/edit-user.component';


interface CustomFile extends File {
  previewUrl?: string;
  downloadLink?: string;
}


@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})


export class UploadDocumentsComponent implements OnInit {


  @Input() user: any;
  @ViewChild('closeView') closeView! : ElementRef;
  @ViewChild('openAskDelDocument') openAskDelDocument! : ElementRef;

  pdfSrcList: any[] = [];
  selectedPdfSrc: any = null;
  selectedFile: CustomFile | null = null;
  files: File [] = [];
  fileName: string = '';
  msg : string = '';
  loadingPdf: boolean = false;
  fileNameBack : string = '';
  selectedPdfBack : any;
  arrIds : any []=[];
  menuDocument: any;
  arrDocument : any []=[];
  showBulk : boolean = false;
  progressBars: { [key: string]: number } = {}; 
  bulkProgress : number = 0;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  phone: boolean = false;
  sentDocumentsArray : any []=[];
  isFileUploaded: boolean[] = [];
  subirTodo : boolean = false;
  removerTodo : boolean = false;



  constructor(
              private userService : UserService,
              private imageUploadService : ImageUploadService,
  ) {

    (screen.width <= 800) ? this.phone = true : this.phone = false;

   }

  ngOnInit(): void {

    this.userService.resetDocumentUpload$.subscribe((emmited)=>{ if(emmited){this.reset()} })

  }



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

closeViewModal(){
  this.closeView.nativeElement.click();
}
    


thumbailsPdf(doc:any ){

  const fileName = doc.filePath.split('/').pop() ;

  const serverURL = 'https://arcanjosaorafael.org/documents/'; 
  
  console.log( `${serverURL}${fileName}`);
    return  `${serverURL}${fileName}`;
}


uploadDocument( file:any, index:number){

//si ya fue enviado q retorne
  if(this.sentDocumentsArray.includes(file)){ return; }

  this.startProgress(index);


  this.userService.uploadDocument(this.user.iduser, file).subscribe(
    ( {success} )=>{
      if(success){
        // this.showSuccess = true;
        this.msg = "Operação de envio bem-sucedida!";
        
        setTimeout(()=>{
           this.progressBars[index] = 100;
           this.isFileUploaded[index] = true; 
          }, 2000 );

        this.userService.reloadDocuments$.emit(true);

        // guardo una copia de lo q ya se envio para evitar duplicados
        this.sentDocumentsArray.push(file);
        
    
      }
    })
}



bulkUploadDocument() {
  const unsentFiles = this.files.filter((file) => !this.sentDocumentsArray.includes(file));


  // Itera sobre los archivos originales
  this.files.forEach((file, index) => {
    // Verifica si el archivo está en unsentFiles
    if (unsentFiles.includes(file)) {
      this.startProgress(index);

      this.showSuccess = false;
      this.userService.uploadDocument(this.user.iduser, file).subscribe(
        ({ success }) => {
          if (success) {
            this.subirTodo = true;
            setTimeout(() => {
              this.bulkProgress = 100;
              this.progressBars[index] = 100;
              this.isFileUploaded[index] = true;
              this.showSuccess = true;
              this.msg = "Operação de envio bem-sucedida!";
              this.userService.reloadDocuments$.emit(true);

              // Agrega el archivo a la lista de enviados solo si no está presente
              if (!this.sentDocumentsArray.includes(file)) {
                this.sentDocumentsArray.push(file);
              }
            }, 2000);
          }
        }
      );
    }
    setTimeout(()=>{ this.reset(); },5000)
    
  }
 );
}

reset(){
    this.isFileUploaded = [];
    this.files = [];
    this.fileName = '';
    this.sentDocumentsArray = [];
    this.bulkProgress = 0;
    this.progressBars = {};
    this.subirTodo = false;
}

closeToast(){
  this.showSuccess = false;
  this.files = [];
  this.pdfSrcList = [];
}

onSelect(event: any): void {

  const addedFiles: File[] = event.addedFiles;

  for (const file of addedFiles) {
    this.readAndShowPDF(file);
    this.files.push(file);
  }
  console.log(this.files);

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

onRemove(file: File): void {

  const fileName = file.name;
  if (this.sentDocumentsArray.some((sentFile) => sentFile.name === fileName)) {
    return;
  }

  this.openAskDelDocument.nativeElement.click();
  

  this.userService.authDelDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
    if(emmited){
        const index = this.files.indexOf(file);
        if (index !== -1) {
          this.files.splice(index, 1);
          this.pdfSrcList.splice(index, 1);
          console.log(this.pdfSrcList);
        }

      }
    })
}

bulkRemove(){
  this.userService.authDelDocument$.pipe(take(1)).subscribe( (emmited)=>{ 
    if(emmited){
        this.reset();

      }
    })
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

startProgress(index: number = -1) {
  if (index !== -1) {
    this.progressBars[index] = 0;
  } else {
    this.bulkProgress = 0;
  }

  const totalSteps = 40;
  const intervalDuration = 50;
  const incrementPerStep = 100 / totalSteps;

  const intervalId = setInterval(() => {
    if (index !== -1) {
      this.progressBars[index] += incrementPerStep;
    } else {
      this.bulkProgress += incrementPerStep;
    }

    if (this.progressBars[index] >= 99) {
      this.progressBars[index] = 99;
      clearInterval(intervalId);
    } else if (this.bulkProgress >= 99) {
      this.bulkProgress = 99;
      clearInterval(intervalId);
    }
  }, intervalDuration);
}


// startProgress(fileId: any) {
//   this.progressBars[fileId] = 0;

//   const totalSteps = 40; // Número total de pasos (100% / 5% cada paso)
//   const intervalDuration = 50; // Duración de cada paso en milisegundos
//   const incrementPerStep = 100 / totalSteps;

//   const intervalId = setInterval(() => {
//     this.progressBars[fileId] += incrementPerStep;

//     if (this.progressBars[fileId] >= 100) {
//       this.progressBars[fileId] = 100;
//       clearInterval(intervalId);
//     }
//   }, intervalDuration);
// }


// end documents

}
