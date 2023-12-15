import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { ImageUploadService } from 'src/app/shared/services/ImageUpload/image-upload.service';
import { ErrorService } from 'src/app/shared/services/error/error.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {

  selectedFile: File | null = null;
  arrBackground : any []=[];
  isLoading : boolean = false;
  msg: string = '';
  showSuccess: boolean = false;
  phone: boolean = false;

  constructor(
              private imageUploadService : ImageUploadService,
              private errorService : ErrorService
  ) { 
  (screen.width <= 800) ? this.phone = true : this.phone = false;

  }

  ngOnInit(): void {

    this.getInitBackground();
    this.errorService.closeIsLoading$.pipe(delay(1500)).subscribe(emitted => emitted && (this.isLoading = false));

  }
  

  getInitBackground(){
    this.isLoading = true;
    this.imageUploadService.getAllBackground().subscribe(
      ( {success, backgrounds} )=>{
        if(success){
          this.arrBackground = backgrounds.map( (doc:any) => {
            const fileName = doc.filePath.split('/').pop();
            const serverURL = 'https://arcanjosaorafael.org/documents/';
            return {
              ...doc,
              filePath: `${serverURL}${fileName}`
            };
          });
          setTimeout(()=>{ this.isLoading= false },700)
          
        }
      })
  }

continue(){
  this.imageUploadService.authDelBackground$.emit(true);
}

closeToast(){
    this.showSuccess = false;
    this.msg = '';

}

  removePicture( picture:any) {

    this.imageUploadService.authDelBackground$.subscribe((auth)=>{
      if(auth){
        this.isLoading = true;
        this.imageUploadService.deleteBackgroundById(picture.idbackground).subscribe(
          ( {success} )=>{
            if(success){
              setTimeout(()=>{this.isLoading = false },1200)
              this.msg = "AFundo eliminado com sucesso."
              this.showSuccess = true;
              this.getInitBackground();
            }
          })

      }})

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.upload();
  }

  upload() {
    this.isLoading = true;
    if (this.selectedFile) {
      this.imageUploadService.uploadImage(this.selectedFile).subscribe( 
        ( {success} )=> {
            if(success){
              setTimeout(()=>{this.isLoading = false });
              alert('Upload bem-sucedido');
              this.selectedFile = null;
              this.getInitBackground();
            } }
        )
          
    }
  }

  
  backgroundOption(event: any, id:any): void{

    this.isLoading = true;

    let backgroundSelected = (event.target as HTMLInputElement).checked;

    let action = null;

    (backgroundSelected ) ? action = "1" : action = "0";

     this.imageUploadService.onOffBackground( id, action ).subscribe(
      ( {success} )=>{
        if(success){
          setTimeout(()=>{ this.isLoading = false },1000)
          this.getInitBackground();
          
        }
      }
     );
    
  }


}
