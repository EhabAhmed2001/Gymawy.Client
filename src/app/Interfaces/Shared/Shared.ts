export interface Address{
  street:string,
  city:string ,
  country:string, 
  location:{
    x: number, //long  
    y: number  //lat
  }
}
export interface AddressGet{
  Street:string,
  City:string ,
  Country:string, 
  Location:{
    X: number, //long  
    Y: number  //lat
  }
}
export interface Item{
  name:string,
  id:number
}
