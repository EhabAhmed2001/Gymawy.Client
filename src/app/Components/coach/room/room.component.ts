import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

@Component({
  selector: 'app-room',
  imports: [],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit , AfterViewInit {
 @ViewChild('root')
  root!: ElementRef;
  roomID:string = '';
  constructor(private _activatedRoute:ActivatedRoute){}

  ngOnInit(): void {
      this._activatedRoute.params.subscribe({
        next: (res) => this.roomID = res['roomId'],

      })
  }

    ngAfterViewInit() {
      const appID = 2036238267;
      const serverSecret = "04edaae8910fe22348ae40ab749fb880";
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID, serverSecret, this.roomID,  Date.now().toString(),  Date.now().toString());
        // appID, serverSecret, this.roomID,  randomID(5),  randomID(5));

      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
         zp.joinRoom({
        container: this.root.nativeElement,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
            window.location.protocol + '//' +
            window.location.host + window.location.pathname +
              '?roomID=' +
              this.roomID,
          },
        ],
    })

}

}
