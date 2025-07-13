import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GymService } from '../../Services/gym.service';
import { GymGet } from '../../Interfaces/Gym/Gym';
import { ActivatedRoute } from '@angular/router';
import { ImageSliderComponent } from '../image-slider/image-slider.component';
import { MapComponent } from '../map/map.component';
import { CommonModule } from '@angular/common';
import { GymOwnerService } from '../../Services/gym-owner.service';
import { GymOwnerInfo } from '../../Interface/GymOwnerInfo';

@Component({
  selector: 'app-gym-details-admin',
  imports: [ImageSliderComponent , MapComponent,CommonModule],
  templateUrl: './gym-details-admin.component.html',
  styleUrl: './gym-details-admin.component.css'
})
export class GymDetailsAdminComponent implements OnInit , AfterViewInit{
    showImagePreview = false;
  previewImageUrl = '';
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
       gymTypeValue:'' ,
       gymFeatures:[]
  }

  GymId!:number
  //@ViewChild(MapComponent, { static: true }) map!: MapComponent;

  constructor(private gymService:GymService ,private route:ActivatedRoute){
    this.GymId =  Number( this.route.snapshot.paramMap.get('id'))
  }
  ngOnInit(): void {
    console.log("dd");
    this.gymService.GetGymWithFeaturesById(this.GymId).subscribe({
      next:(responce)=>{
        this.gym = responce
        console.log(this.gym)
      },
      error:(e)=>{
        console.log(e)
      }
    })
  }
 
  openImagePreview(imageUrl: string): void {
    this.previewImageUrl = imageUrl;
    this.showImagePreview = true;
  }
  
  closeImagePreview(): void {
    this.showImagePreview = false;
    this.previewImageUrl = '';
  }
  ngAfterViewInit(): void {/*
    this.gymService.GetGymById(this.GymId).subscribe({
      next:(response) =>{

          console.log(this.gym.address.location.y)
          this.map.setMarker(this.gym.address.location.y,this.gym.address.location.x)     
      }
      
    })*/
  }
}
