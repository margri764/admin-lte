
export class User {


    constructor(
        public iduser: number, 
        public name: string,
        public lastName: string,
        public fullName: string,
        public email: string,
        public birthday: string, 
        public headquarterName:string,
        public headquarterCity: string,
        public headquarterCountry: string,
        public phone: string,
        public ordem: string,
        public validateEmail: string,
        public password: string,
        public status: number,
        public role: string,
        public country: string,
        public actualAddress: string,
        public linkCongregatio: any,
        public active: any,
        public img : string,
        public history? : string
        )
        {}
  
  }