import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../shared/text-input/text-input.component';
import { MapComponent } from '../../map/map.component';
import { PhotoEditorComponent } from '../../members/photo-editor/photo-editor.component';
import { UploadImagesComponent } from '../../upload-images/upload-images.component';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../Services/auth.service';
import { CoachService } from '../../../Services/coach.service';
import { GymOwnerService } from '../../../Services/gym-owner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-as-gym-owner',
  imports: [CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    MapComponent,
    FormsModule,RouterLink],
  templateUrl: './register-as-gym-owner.component.html',
  styleUrl: './register-as-gym-owner.component.css'
})
export class RegisterAsGymOwnerComponent {


constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _gymOwnerService: GymOwnerService,
    private _router: Router,
    private _toastrService: ToastrService
  ) {}
  RegisterSubscription: Subscription = new Subscription();
  validationErrors: string[] | undefined;

  registerForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    role: new FormControl('owner', Validators.required),

  });

   Register(registerFormValue: FormGroup): void {
    if (registerFormValue.valid) {

      const values = { ...registerFormValue.value};
      console.log(values);
      this.RegisterSubscription = this._authService
        .setGymOwnerRegister(values)
        .subscribe({
          next: (response) => {
            console.log(response);
             this._router.navigate(['/login']);

          },
          error: (err) => {
            this.validationErrors = err; //will get it back form my interceptor arry error
            this._toastrService.error(err.error);
          },
        });
    } else registerFormValue.markAllAsTouched();
  }




}
