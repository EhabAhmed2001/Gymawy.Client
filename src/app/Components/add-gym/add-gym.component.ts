import { Component, OnInit } from '@angular/core';
import { Gym, SelectedGymFeature } from '../../Interfaces/Gym/Gym';
import { MapComponent } from "../map/map.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GymService } from '../../Services/gym.service';
import { Item } from '../../Interfaces/Shared/Shared';
import { UploadImagesComponent } from "../upload-images/upload-images.component";
import { ImageSliderComponent } from "../image-slider/image-slider.component";
import { Router } from '@angular/router';
import { GymOwnerInfo } from '../../Interface/GymOwnerInfo';
import { GymOwnerService } from '../../Services/gym-owner.service';

@Component({
  selector: 'app-add-gym',
  imports: [MapComponent, ReactiveFormsModule, CommonModule,
    UploadImagesComponent, ImageSliderComponent],
  templateUrl: './add-gym.component.html',
  styleUrl: './add-gym.component.css'
})
export class AddGymComponent implements OnInit {
  gymTypes!:Item[]
  features!:Item[]
  selectedFeatures:SelectedGymFeature[]=[]
  currentSelectedFeatureImgeFile:File|any=null;
  currentSelectedFeatureImgeUrl:string|null=null
  currentSelectedFeature:Item|null = null
  gym:Gym={
      Name :"",
      Phone:"",
      Description :"",
      GymType :0,
      GymOwnerId:0,
      Address:{
        street:"",
        city:"" ,
        country:"",
        location:{
          x: 0, //long
          y: 0  //lat
        }
      } ,
      GymExtraFeatures:[],
      GymFeatures:[],
      GymImages:[],
      //Media:null
  }
  logoUrl:string|null=null
  logoFile!:File
  uploadedGymImages:File[]|null=null
  formAddFeature!:FormGroup
  formAddGym:FormGroup=new FormGroup({
      name: new FormControl(this.gym.Name,[Validators.required]),
      phone:new FormControl(this.gym.Phone,[Validators.required,Validators.pattern(/^\+?[0-9]{10,15}$/)]),
      description:new FormControl(this.gym.Description,[Validators.required]),
      uploadImage:new FormControl(this.gym.GymImages,[Validators.required]),
      gymType:new FormControl(this.gym.GymType,[Validators.required]),
      searchAddress:new FormControl(""),
      street:new FormControl(this.gym.Address.street,[Validators.required]),
      city:new FormControl(this.gym.Address.city,[Validators.required]),
      country:new FormControl(this.gym.Address.country,[Validators.required]),
      logo:new FormControl([Validators.required]),
    })

    public ownerInfo: GymOwnerInfo = {
      firstName:'',
      lastName:'',
      email:'',
      userName: '',
      phoneNumber:''
    }

  loadOwnerInfo(): void {
    this.gymOwnerService.getOwnerInfo().subscribe({

    }
    );
  }

  get uploadImageControl(): FormControl {
    return this.formAddGym.get('uploadImage') as FormControl;
  }
  setUploadedImges(e:any){
    this.uploadedGymImages = e
  }
  private initformAddFeature() {
    console.log(this.currentSelectedFeature);
    this.formAddFeature=new FormGroup({
      name:new FormControl("",this.currentSelectedFeature?.id==-1? Validators.required : null),
      description:new FormControl("",[Validators.required]),
      image:new FormControl("",[Validators.required]),
      cost:new FormControl("",[Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.min(0.01)]),
    })
  }
  constructor(private gymService:GymService , private route:Router,private gymOwnerService:GymOwnerService) {

  }
  ngOnInit(): void {
    this.initformAddFeature()
    this.gymService.GetGymTypes().subscribe({
      next:(res)=>{
        this.gymTypes = res
        console.log(this.gymTypes)
      }
    })
    this.gymService.GetGymFeatures().subscribe({
      next:(res)=>{
        this.features =res
        console.log(this.features)
      }
    })
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

  uploadFeatureImage(event:any){
    const input = event.target as HTMLInputElement
    if(!input.files) return
    this.currentSelectedFeatureImgeUrl=null;
    this.currentSelectedFeatureImgeFile=input.files[0]
    const fileReader = new FileReader();
    fileReader.onload=(e:any)=>{
      this.currentSelectedFeatureImgeUrl=e.target.result
    }
    fileReader.readAsDataURL(input.files[0])
  }



  setAddress(event:any){
    //this.gym.Address.Street=event.street
    console.log(event)
    this.formAddGym.get('city')?.setValue(event.city)
    this.formAddGym.get('street')?.setValue(event.street)

    this.formAddGym.get('country')?.setValue(event.country)

    this.gym.Address.location.x = event.lng
    this.gym.Address.location.y = event.lat
  }
  updateImages(event:any){
    console.log(event)
  }
  submitFormAddGym(){
    console.log(this.formAddGym.valid )

    for (const control of Object.values(this.formAddGym.controls)) {
      control.markAsTouched();
    }

    if(this.formAddGym.valid &&this.selectedFeatures.length>0){
  // Basic gym info
      const formData = new FormData();

      this.gym.Name= this.formAddGym.get('name')?.value,
      this.gym.Phone= this.formAddGym.get('phone')?.value,
      this.gym.Description= this.formAddGym.get('description')?.value,
      this.gym.GymType= Number( this.formAddGym.get('gymType')?.value),

      this.gym.GymOwnerId= 1,
      this.gym.Address.street=this.formAddGym.get('street')?.value
      this.gym.Address.city=this.formAddGym.get('city')?.value
      this.gym.Address.country=this.formAddGym.get('country')?.value
      this.gym.GymExtraFeatures=this.selectedFeatures
                                    .filter(f=>f.FeatureId === -1)
                                    .map(sf=>{
                                               formData.append('GymExtraFeaturesImages', sf.Image)
                                              console.log(sf.Image)
                                               return{Name:sf.Name ??'' , Description: sf.Description,Cost: sf.Cost }
                                              }
                                        )
      this.gym.GymFeatures = this.selectedFeatures
                                  .filter(f=>f.FeatureId != -1)
                                  .map( sf=>{
                                              formData.append('GymFeaturesImages', sf.Image)
                                              console.log(sf.Image)
                                              return {FeatureId:sf.FeatureId , Description: sf.Description,Cost: sf.Cost }
                                            }
                                  )
      //this.gym.Media = this.logoFile


    console.log(formData.get('GymFeaturesImages'))
    formData.append("gymInfo", JSON.stringify(this.gym));
    formData.append("Media",this.logoFile);

    // Append files
    const files = this.uploadedGymImages;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('GymImages', files[i]);
      }
    }
    console.log(formData)
    this.gymService.AddGym(formData).subscribe({
      next:(res)=>{
        console.log(res)
        this.route.navigate(['/gym-owner/GymDetails',res]);
        this.loadOwnerInfo()
      }
    });
    

  }
}

  selectFeature(item:Item|null){
            this.initformAddFeature()

    if(item==null)
      this.currentSelectedFeature={name:"",id:-1}
    else
      this.currentSelectedFeature= item
     console.log(item)
  }
  saveFeatureConfig(): void {

   console.log(this.formAddFeature)
    if(this.formAddFeature.valid){ //this.formAddFeature.valid
          const AddedSelectedFeature: SelectedGymFeature = {
          Name: this.currentSelectedFeature?.id==-1? this.formAddFeature.get('name')?.value:this.currentSelectedFeature?.name,
          FeatureId:this.currentSelectedFeature?.id,
          Cost: this.formAddFeature.get('cost')?.value ,
          Description: this.formAddFeature.get('description')?.value ,
          Image: this.currentSelectedFeatureImgeFile,
          ImageUrl:this.currentSelectedFeatureImgeUrl
        };
        console.log(AddedSelectedFeature)
        this.selectedFeatures.push(AddedSelectedFeature)

        if(this.currentSelectedFeature?.id!=-1){
          var index= this.features.findIndex(f=>f.id==this.currentSelectedFeature?.id);
          if (index !== -1) {
            this.features.splice(index, 1);
          }
        }
        this.currentSelectedFeature = null;
        this.currentSelectedFeatureImgeFile = null;
        this.currentSelectedFeatureImgeUrl = null;
    }
  }
  removeFeature(index:number){
    console.log(index)
    const selectedFeature:any= this.selectedFeatures[index]
    if(selectedFeature.FeatureId!=-1){
      const feature:Item={name:selectedFeature.Name, id:selectedFeature.FeatureId }
      this.features.push(feature)
    }
    this.selectedFeatures.splice(index,1)

  }
  closeModal(){
    this.currentSelectedFeature=null
  }

}
