export interface Address{
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
