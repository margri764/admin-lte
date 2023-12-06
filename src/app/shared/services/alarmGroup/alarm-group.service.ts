import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmGroupService {

  private baseUrl = environment.baseUrl;

  authDelGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  constructor(
              private http : HttpClient,

  )       

  {  }


  createGroup( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/group/createGroup`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllGroups(){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getAllGroups`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllGroups service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  editGroup( id:any, body:any ){
    
    return this.http.put<any>(`${this.baseUrl}api/group/updateGroupById/${id}`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from body service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteGroup( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/group/deleteGroup/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

}
