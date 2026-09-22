import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare const L: any;

@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MapPage implements AfterViewInit, OnDestroy {
  private map: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 200);
  }

  initMap() {
    if (this.map) return;

    // Coordenadas fijas en Santiago / Providencia
    this.map = L.map('map').setView([-33.4328, -70.6186], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // Estación Providencia
    L.marker([-33.4328, -70.6186])
      .addTo(this.map)
      .bindPopup('<b>Estación Providencia</b><br>AQI: 54 (Aceptable)')
      .openPopup();

    // Estación Santiago Centro / Parque O\'Higgins
    L.marker([-33.4569, -70.6586])
      .addTo(this.map)
      .bindPopup('<b>Estación Parque O\'Higgins</b><br>AQI: 58 (Aceptable)');

    // Estación Pudahuel
    L.marker([-33.4372, -70.7494])
      .addTo(this.map)
      .bindPopup('<b>Estación Pudahuel</b><br>AQI: 68 (Aceptable)');

    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);
  }

  locateUser() {
    if (navigator.geolocation && this.map) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.map.setView([lat, lng], 14);
          L.circleMarker([lat, lng], {
            radius: 8,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.8
          }).addTo(this.map).bindPopup('Estás aquí').openPopup();
        },
        (err) => console.warn('Error al obtener ubicación:', err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}