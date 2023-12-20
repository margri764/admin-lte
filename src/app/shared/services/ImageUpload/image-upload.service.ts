import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private baseUrl = environment.baseUrl;
  authDelBackground$ : EventEmitter<boolean> = new EventEmitter<boolean>; 


  constructor(
               private http: HttpClient
  ) { }


  
  uploadImage(file: File) {

    console.log(file);
    const formData = new FormData();
    formData.append('file', file);


      return this.http.post<any>(`${this.baseUrl}api/image/uploadBackground/`, formData) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from uploadImage service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }

  uploadUserImg( file: File, id:any) {

    const formData = new FormData();
    formData.append('file', file);


      return this.http.post<any>(`${this.baseUrl}api/image/uploadUserImg/${id}`, formData) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from uploadUserImg service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }



  

  getAllBackground( ) {


    return this.http.get<any>(`${this.baseUrl}api/image/getAllBackground`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllBackground service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  onOffBackground( id: any, action:any ){

    
    return this.http.patch<any>(`${this.baseUrl}api/image/onOffBackground/${id}/?action=${action}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from onOffBackground service: ", res);
                }  
      ),            
      map( res => res )
    )
  }

  deleteBackgroundById( id:any ) {


      return this.http.patch<any>(`${this.baseUrl}api/image/deleteBackgroundById/${id}`, null) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from deleteBackgroundById service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }

  bulkDeleteDocuments( body:any ) {

      return this.http.patch<any>(`${this.baseUrl}api/document/bulkDeleteDocuments/`, body) 
      
      .pipe(
        tap( ( res) =>{
                      console.log("from bulkDeleteDocuments service: ",res);
                  }  
        ),            
        map( res => res )
      )
  }


  

}
