import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { TimeagoModule } from 'ngx-timeago';
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(),
    provideToastr({
  positionClass: 'toast-top-left',
  toastClass: 'ngx-toastr custom-toast',
  timeOut: 2000,
  progressBar: true,
  closeButton: true,
}),
    BrowserAnimationsModule,
    importProvidersFrom(TimeagoModule.forRoot()),
    // NgxSpinnerModule,
  ]
}).catch(err => console.error(err));
