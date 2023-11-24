import { Injectable } from '@angular/core';
import { getDataLS, saveDataLS, saveDataSS } from '../../storage';
import { AppState } from '../../redux/app.reducer';
import { Store } from '@ngrx/store';
import * as authAction from 'src/app/shared/redux/auth.actions'


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(
    private store: Store<AppState>,
    ) 
{
}

loadInitialState() {
const user = getDataLS("user");



if(user !== undefined && user !== null){
this.store.dispatch(authAction.setUser({ user }));
}

}

saveStateToLocalStorage(dataToSave: any, keyLStorage : string) {
saveDataLS(keyLStorage, dataToSave);
}

saveStateToSessionStorage(dataToSave: any, keyLStorage : string) {
saveDataSS(keyLStorage, dataToSave);
}


}