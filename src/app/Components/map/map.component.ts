import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker | null;
  addressSearch: string = '';

  // Emit only street, city, and country (add zip or state if needed)
  @Output() addressChange = new EventEmitter<{
    street: string;
    city: string;
    country: string;
  }>();
  @Output() coordinatesChange = new EventEmitter<{ lat: number; lng: number }>();

  ngOnInit(): void {
    // Fix Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    const iconRetinaUrl = '/leaflet/marker-icon-2x.png';
    const iconUrl = '/leaflet/marker-icon.png';
    const shadowUrl = '/leaflet/marker-shadow.png';
    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([30.0444, 31.2357], 13); // Default to Cairo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.log('Geolocation error:', error.message);
        }
      );
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.setMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });
  }

  setMarker(lat: number, lng: number): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng]).addTo(this.map);
   // this.coordinatesChange.emit({ lat, lng });
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: { 'User-Agent': 'GymRegistrationApp/1.0 (your.email@example.com)' }
    })
      .then(response => {
        if (!response.ok) throw new Error('Geocoding failed');
        return response.json();
      })
      .then(data => {
        console.log('Reverse Geocode Response:', data); // Debug
        if (data.display_name) {
          const address = data.address || {};
          const displayParts = data.display_name.split(',');

          // Extract street: prefer address.road or house_number, fallback to display_name[0]
          const street = address.house_number && address.road
            ? `${address.house_number} ${address.road}`
            : address.road || displayParts[0] || '';

          // Extract city: check multiple fields, fallback to display_name[1] if available
          const city = address.city || address.town || address.village || address.suburb || 
                      address.municipality || address.county || 
                      (displayParts.length > 1 ? displayParts[1] : '');

          // Extract country: prefer address.country, fallback to last part of display_name
          const country = address.country || (displayParts.length > 0 ? displayParts[displayParts.length - 1] : '');

          const emittedData = { street, city, country,lat,lng };
          console.log('Emitted Address:', emittedData); // Debug
          this.addressChange.emit(emittedData);

          if (!city) {
            console.warn('Missing city:', emittedData);
            alert('City not found. Please verify the location or enter manually.');
          }
        } else {
          alert('Address not found for this location.');
        }
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        alert('Error fetching address. Please try again.');
      });
  }

  searchAddress(value:string): void {
    this.addressSearch = value
    if (!this.addressSearch.trim() || this.addressSearch=="" ) {
      //alert('Please enter an address to search.');
      return;
    }
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.addressSearch)}`, {
      headers: { 'User-Agent': 'GymRegistrationApp/1.0 (your.email@example.com)' }
    })
      .then(response => {
        if (!response.ok) throw new Error('Geocoding failed');
        return response.json();
      })
      .then(data => {
        console.log('Search Address Response:', data); // Debug
        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const address = data[0].address || {};
          const displayParts = display_name.split(',');

          // Extract street: prefer address.road or house_number, fallback to display_name[0]
          const street = address.house_number && address.road
            ? `${address.house_number} ${address.road}`
            : address.road || displayParts[0] || '';

          // Extract city: check multiple fields, fallback to display_name[1] if available
          const city = address.city || address.town || address.village || address.suburb || 
                      address.municipality || address.county || 
                      (displayParts.length > 1 ? displayParts[1] : '');

          // Extract country: prefer address.country, fallback to last part of display_name
          const country = address.country || (displayParts.length > 0 ? displayParts[displayParts.length - 1] : '');

          this.map.setView([parseFloat(lat), parseFloat(lon)], 16);
          this.setMarker(parseFloat(lat), parseFloat(lon));

          const emittedData = { street, city, country , lat, lon };
          console.log('Emitted Address:', emittedData); // Debug
          this.addressChange.emit(emittedData);

          if (!city) {
            console.warn('Missing city:', emittedData);
            alert('City not found. Please verify the address or enter manually.');
          }
        } else {
          alert('Address not found. Please try a different address.');
        }
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        alert('Error searching address. Please try again.');
      });
  }
}