import { Action, createReducer, on } from '@ngrx/store';
import { setUser, unSetUser } from './auth.actions';
import { User } from '../models/user.models';



export interface Auth {
    user: any | null; 
   
}

export const initialState: Auth = {
     user: null,
}

const _authReducer = createReducer(initialState,

    on( setUser, (state, { user }) => ({ ...state, user: { ...user }  })),
    on( unSetUser, state => ({ ...state, user: null  })),
    
);

export function authReducer(state: Auth | undefined, action: Action) {
    return _authReducer(state, action);
}