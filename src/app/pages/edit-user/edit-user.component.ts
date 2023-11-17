import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import 'bootstrap-switch';


// interface CustomFile extends File {
//   previewUrl?: string;
// }

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


files: File[] = [];
pdfSrc :any;
selectedPdfSrc: any = null;
pdfSrcList: any[] = [];
loadingPdf: boolean = false;
selectedFile: CustomFile | null = null;



  constructor() { }

  ngOnInit(): void {

    $("input[data-bootstrap-switch]").each(function() {
      $(this).bootstrapSwitch('state',  $(this).prop('checked'));
    });

    }
    

    onSelect(event: any): void {
      const addedFiles: File[] = event.addedFiles;
  
      for (const file of addedFiles) {
        this.readAndShowPDF(file);
        this.files.push(file);
      }

    }
  
    onRemove(file: File): void {
      const index = this.files.indexOf(file);
      if (index !== -1) {
        this.files.splice(index, 1);
  
        // Puedes restablecer la fuente de pdf-viewer si no hay más archivos
        // if (this.files.length === 0) {
        //   this.pdfSrc = null;
        // }

        if (this.selectedPdfSrc === this.pdfSrcList[index]) {
          this.selectedPdfSrc = null;
        }
      }
    }

    readAndShowPDF(file: File): void {

      const reader = new FileReader();
      this.loadingPdf = true;
    
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const downloadLink = base64Data;
        
        this.pdfSrcList.push({ preview: base64Data, downloadLink });
        this.loadingPdf = false;
      };
    
      reader.readAsDataURL(file);
    }
    
fileName: string = '';

    onViewClick( name:string, index: number): void {

      if(this.pdfSrcList[index]){
        setTimeout( ()=>{
            this.selectedPdfSrc = this.pdfSrcList[index];
            console.log(this.selectedPdfSrc);
            this.selectedFile = this.files[index];
            this.fileName = name;
          }, 200)
      }
      
    }
}
