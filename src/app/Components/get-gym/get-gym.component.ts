import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GymService } from '../../Services/gym.service';
import { GymGet, GymUpdate } from '../../Interfaces/Gym/Gym';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Item } from '../../Interfaces/Shared/Shared';
import { UploadImagesComponent } from '../upload-images/upload-images.component';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { ImageSliderComponent } from "../image-slider/image-slider.component";

@Component({
  selector: 'app-get-gym',
  imports: [MapComponent, ReactiveFormsModule, CommonModule, UploadImagesComponent, ImageSliderComponent],
  templateUrl: './get-gym.component.html',
  styleUrl: './get-gym.component.css'
})
export class GetGymComponent implements OnInit ,  AfterViewInit {
  gym:GymGet= {
       address:{
        city:"",
        country:"",
        street:"",
        location:{
          x:0,
          y:0
        }  
       },
       gymType:0,
       mediaUrl:"",
       gymImagesUrl:[],
       name:"",
       phone:"",
       description:"",
       gymTypeValue:"",
       gymFeatures:[]
  }
  GymId!:number
  formAddGym!:FormGroup
  isDisabled:boolean = false
  gymTypes!:Item[]
  logoUrl:string|null=null
  logoFile!:File
  gymImagesUrl:string[]=[]
  GymImagesUploadedFile:File[]|null=null

  gymUpdate: GymUpdate={
    name :"",
    phone:"",
    description :"",
    gymType :-1,
   address:{
        city:"",
        country:"",
        street:"",
        location:{
          x:0,
          y:0
        }  
       }, 
  }
  @ViewChild(MapComponent, { static: true }) map!: MapComponent;

  setGymeImages(imagesfiles:any){
    this.GymImagesUploadedFile = imagesfiles;
  }
  constructor(private gymService:GymService ,private route:ActivatedRoute){
    this.GymId =  Number( this.route.snapshot.paramMap.get('id'))
    
      this.formAddGym=new FormGroup({
      name: new FormControl("",[Validators.required]),
      phone:new FormControl("",[Validators.required,Validators.pattern(/^\+?[0-9]{10,15}$/)]),
      description:new FormControl("",[Validators.required]),
      uploadImage:new FormControl(null),
      gymType:new FormControl(0,[Validators.required]),
      searchAddress:new FormControl(""),
      street:new FormControl("",[Validators.required]),
      city:new FormControl("",[Validators.required]), 
      country:new FormControl("",[Validators.required]), 
      logo:new FormControl(null), 
    })
  }
  ngAfterViewInit(): void {
    this.gymService.GetGymById(this.GymId).subscribe({
      next:(response) =>{
          console.log(this.gym.address.location.y)
              this.map.setMarker(this.gym.address.location.y,this.gym.address.location.x)     
              this.formAddGym.get('street')?.setValue(this.gym.address.street);
              this.formAddGym.get('city')?.setValue(this.gym.address.city);
              this.formAddGym.get('country')?.setValue(this.gym.address.country);
              this.formAddGym.disable();
      }
      
    })
  }
  ngOnInit(): void {
    this.gymService.GetGymById(this.GymId).subscribe({
      next:(response) =>{
        this.gym=response
        console.log(this.gym)
        this.logoUrl = this.gym.mediaUrl
        this.formAddGym.patchValue(this.gym)
        this.gymImagesUrl = [...this.gym.gymImagesUrl]
        
        console.log("D");
      },
      error:(e)=>{
        console.log(e)
      }
      
    })

    this.gymService.GetGymTypes().subscribe({
      next:(res)=>{
        this.gymTypes = res
        console.log(this.gymTypes)
      }
    })

  }
  loadData(){
      this.gymService.GetGymById(this.GymId).subscribe({
      next:(response) =>{
        this.gym=response
        console.log(this.gym)
        this.logoUrl = this.gym.mediaUrl
        this.formAddGym.patchValue(this.gym)
        this.gymImagesUrl = [...this.gym.gymImagesUrl]
        
        console.log("D");
      },
      error:(e)=>{
        console.log(e)
      }
      
    })

    this.gymService.GetGymTypes().subscribe({
      next:(res)=>{
        this.gymTypes = res
        console.log(this.gymTypes)
      }
    })  
  }

  get uploadImageControl(): FormControl {
    return this.formAddGym.get('uploadImage') as FormControl;
  }


  
  uploadLogo(event:any){
    const input = event.target as HTMLInputElement
    if(!input.files) return
    this.logoUrl=null;
    this.logoFile =input.files[0]; 
    const fileReader = new FileReader();
    fileReader.onload=(e:any)=>{
      this.logoUrl=e.target.result
    }
    fileReader.readAsDataURL(input.files[0])
  }


  setAddress(event:any){
    //this.gym.Address.Street=event.street
    console.log(event)
    this.formAddGym.get('city')?.setValue(event.city)
    this.formAddGym.get('street')?.setValue(event.street)

    this.formAddGym.get('country')?.setValue(event.country)

    this.gymUpdate.address.location.x = event.lng
    this.gymUpdate.address.location.y = event.lat

    this.gym.address.location.x = event.lng
    this.gym.address.location.y = event.lat
  }
  updateImages(event:any){
    console.log(event)
  }

 CancelUpdate(){
    this.logoUrl = this.gym.mediaUrl
    this.gymImagesUrl = [...this.gym.gymImagesUrl]
    this.formAddGym.patchValue(this.gym)
    this.map.setMarker(this.gym.address.location.y,this.gym.address.location.x)     
    this.formAddGym.get('street')?.setValue(this.gym.address.street);
    this.formAddGym.get('city')?.setValue(this.gym.address.city);
    this.formAddGym.get('country')?.setValue(this.gym.address.country);
    this.GymImagesUploadedFile = null;
    this.formAddGym.disable();

 } 
  submitFormAddGym(){
    if(this.formAddGym.disabled){
      this.formAddGym.enable()
      return;
    }

    for (const control of Object.values(this.formAddGym.controls)) {
      control.markAsTouched();
    }

    if(this.formAddGym.valid ){
      const formData = new FormData();
     
      console.log(this.formAddGym.get('name')?.value)
      this.gymUpdate.name= this.formAddGym.get('name')?.value,
      this.gymUpdate.phone= this.formAddGym.get('phone')?.value,
      this.gymUpdate.description= this.formAddGym.get('description')?.value,
      this.gymUpdate.gymType= Number( this.formAddGym.get('gymType')?.value) ,
      this.gymUpdate.address.street=this.formAddGym.get('street')?.value
      this.gymUpdate.address.city=this.formAddGym.get('city')?.value
      this.gymUpdate.address.country=this.formAddGym.get('country')?.value

      console.log(this.gymUpdate)
      formData.append("gymInfo", JSON.stringify(this.gymUpdate));
      formData.append("Media",this.logoFile);
    // Append files
      const files = this.GymImagesUploadedFile;
      console.log(files)
      if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('GymImages', files[i]);
      }
    }
    console.log(formData)
    this.gymService.UpdateGym(this.GymId,formData).subscribe({
      next:(res)=>{
        this.loadData();
        this.CancelUpdate();
        console.log("updated")
      }
    });

  }
}




}
