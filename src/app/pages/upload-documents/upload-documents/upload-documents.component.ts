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
  bulkProgresss : number = 0;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  phone: boolean = false;

  constructor(
              private userService : UserService,
              private imageUploadService : ImageUploadService,
  ) {

    (screen.width <= 800) ? this.phone = true : this.phone = false;

   }

  ngOnInit(): void {
  }

   // start documents
   continue(){
    this.userService.authDelDocument$.emit( true );
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


uploadDocument( file:any, index:number){

  this.startProgress(index);

  this.userService.uploadDocument(this.user.iduser, file).subscribe(
    ( {success} )=>{
      if(success){
        // this.showSuccess = true;
        this.msg = "Operação de envio bem-sucedida!";
        setTimeout(()=>{ this.progressBars[index] = 100 },2500 )
        this.userService.reloadDocuments$.emit(true);

      }
    })
}

bulkUploadDocument( ){

  this.showSuccess = false;
  this.userService.bulkUploadDocuments(this.user.iduser, this.files).subscribe(
    ( {success} )=>{
      if(success){
        this.bulkProgresss = 100;
        this.showSuccess = true;
        this.msg = "Operação de envio bem-sucedida!";
        setTimeout(()=>{
         this.userService.closeDocumentModal$.emit(true);
         this.userService.reloadDocuments$.emit(true);
        },2500)
      }
    })
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







startProgress(fileId: any) {
  this.progressBars[fileId] = 0;

  const intervalId = setInterval(() => {
    this.progressBars[fileId] += 5;

    if (this.progressBars[fileId] >= 100) {
      this.progressBars[fileId] = 100;
      clearInterval(intervalId);
    }
  }, 100);
}




// end documents

}
