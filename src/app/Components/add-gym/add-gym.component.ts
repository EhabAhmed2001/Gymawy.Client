import { Component, OnInit } from '@angular/core';
import { Gym, SelectedGymFeature } from '../../Interfaces/Gym/Gym';
import { MapComponent } from "../map/map.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GymService } from '../../Services/gym.service';
import { Item } from '../../Interfaces/Shared/Shared';

@Component({
  selector: 'app-add-gym',
  imports: [MapComponent , ReactiveFormsModule,CommonModule],
  templateUrl: './add-gym.component.html',
  styleUrl: './add-gym.component.css'
})
export class AddGymComponent implements OnInit {
  gymTypes!:Item[]
  features!:Item[]
  selectedFeatures:SelectedGymFeature[]=[]
  currentSelectedFeature:Item|null = null
  gym:Gym={
      Name :"",
      Phone:"",
      Description :"",
      GymType :0,
      GymOwnerId:0,
      Address:{
        Street:"",
        City:"" ,
        Country:"", 
        Location:{
          X: 0, //long  
          Y: 0  //lat
        }       
      } ,
      GymExtraFeatures:[],
      GymFeatures:[]
  }
  formAddFeature!:FormGroup
  formAddGym:FormGroup=new FormGroup({
      name: new FormControl(this.gym.Name,[Validators.required]),
      phone:new FormControl(this.gym.Phone,[Validators.required,Validators.pattern(/^\+?[0-9]{10,15}$/)]),
      description:new FormControl(this.gym.Description,[Validators.required]),
      gymType:new FormControl(this.gym.GymType,[Validators.required]),
      searchAddress:new FormControl("",[Validators.required]),
      street:new FormControl(this.gym.Address.Street,[Validators.required]),
      city:new FormControl(this.gym.Address.City,[Validators.required]), 
      country:new FormControl(this.gym.Address.Country,[Validators.required]), 
    })


  private initformAddFeature() {
    console.log(this.currentSelectedFeature);
    this.formAddFeature=new FormGroup({
      name:new FormControl("",this.currentSelectedFeature?.id==-1? Validators.required : null),
      description:new FormControl("",[Validators.required]),
      image:new FormControl("",[Validators.required]),
      cost:new FormControl("",[Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/),Validators.min(0.01)]),
    })
  }
  constructor(private gymService:GymService) {
    
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


  setAddress(event:any){
    //this.gym.Address.Street=event.street
    console.log(event)
    this.formAddGym.get('city')?.setValue(event.city)
    this.formAddGym.get('street')?.setValue(event.street)
    this.formAddGym.get('country')?.setValue(event.country)
    this.gym.Address.Location.X = event.lon
    this.gym.Address.Location.Y = event.lat
  }

  submitFormAddGym(){

    if(this.formAddGym.valid &&this.selectedFeatures.length>0){
      this.gym.Name = this.formAddGym.get('name')?.value
      this.gym.Phone = this.formAddGym.get('phone')?.value
      this.gym.Description = this.formAddGym.get('description')?.value
      this.gym.Address.Street = this.formAddGym.get('street')?.value
      this.gym.Address.City = this.formAddGym.get('city')?.value     
      this.gym.Address.Country = this.formAddGym.get('country')?.value
      this.gym.GymOwnerId=1
      this.gym.GymExtraFeatures=this.selectedFeatures.filter(f=>f.FeatureId === -1).map(sf=>({Name:sf.Name ??'', Image:sf.Image , Description: sf.Description,Cost: sf.Cost })) 
      this.gym.GymFeatures = this.selectedFeatures.filter(f=>f.FeatureId != -1).map(sf=>({FeatureId:sf.FeatureId , Image:sf.Image , Description: sf.Description,Cost: sf.Cost })) 
      console.log( this.selectedFeatures.filter(f=>f.FeatureId === -1).map(sf=>({Name:sf.Name , Image:sf.Image , Description: sf.Description,Cost: sf.Cost })))
      this.gymService.AddGym(this.gym).subscribe({
        next:(res)=>{

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
          Image: this.formAddFeature.get('image')?.value
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
