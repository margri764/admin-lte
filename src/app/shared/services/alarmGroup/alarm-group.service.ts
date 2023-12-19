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
  authDelUserGroup$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelAlarm$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

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

  createPersonalAlarm( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/alarm/createPersonalAlarm`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  createGrupalAlarm( body:any ){
    
    return this.http.post<any>(`${this.baseUrl}api/alarm/createGrupalAlarm`, body) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from createAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAllPersonalAlarms(){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAllPersonalAlarms`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllPersonalAlarms service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getUsersFromGroup( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getUsersFromGroup/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getUsersFromGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  searchUserInGroup( id:any, query:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/searchUserInGroup/${id}?querySearch= ${query}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from searchUserInGroup service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

 

  getAllGrupalAlarms(){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAllGrupalAlarms`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAllGrupalAlarms service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  getAlarmByUser( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/alarm/getAlarmByUser/${id}`) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from getAlarmByUser service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  deleteAlarm( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/alarm/deleteAlarm/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  activePauseAlarm( id:any, action:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/alarm/activePauseAlarm/${id}?action=${action}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from activePauseAlarm service: ",res);
                }  
      ),            
      map( res => res )
    )

  }

  
  deleteUserFromGroup( id:any ){
    
    return this.http.patch<any>(`${this.baseUrl}api/group/deleteUserFromGroup/${id}`, null) 
    
    .pipe(
      tap( ( res) =>{
                    console.log("from deleteUserFromGroup service: ",res);
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

  getGroupByUserId( id:any ){
    
    return this.http.get<any>(`${this.baseUrl}api/group/getGroupByUserId/${id}`) 
    .pipe(
      tap( ( res) =>{
                    console.log("from getGroupByUserId service: ",res);
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
