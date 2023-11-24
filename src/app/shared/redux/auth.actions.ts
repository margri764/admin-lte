import { createAction, props } from "@ngrx/store";



/************************** SET *******************************/
export const setUser = createAction( '[Auth] setUser',
    props<{ user: any }>()
);



/************************** UNSET *******************************/
export const unSetUser = createAction('[Auth] unSetUser');
