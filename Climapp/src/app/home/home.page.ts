import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RecommendationItem {
  iconSrc: string;
  text: string;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

interface ForecastPeriod {
  timeLabel: string;
  iconSrc: string;
  statusText: string;
  heroIconSrc: string;
  pm25: string;
  pm10: string;
  statusClass: string;
}

interface AirData {
  city: string;
  statusClass: string;
  statusText: string;
  heroIconSrc: string;
  pm25: string;
  pm10: string;
  recommendations: RecommendationItem[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomePage implements OnInit {
  locations: string[] = [
    'La Farfana',
    'Ciudad Satélite',
    'Los Pajaritos Sur',
    'El Abrazo de Maipú',
    'Rinconada Rural',
    'Templo Votivo',
    'Pehuén',
    'Sol Poniente',
    'Santa Ana de Chena',
    'Los Héroes',
    'Tres Poniente',
    'Los Bosquinos',
    'Maipú Centro',
    'Longitudinal',
    'Lo Errázuriz',
    'Hospital - Campos de Batallla',
    'Cuatro Álamos',
    'Portal del Sol',
    'Riesco',
    'Industrial',
    'Clotario Blest'
  ];

  faqList: FaqItem[] = [
    {
      question: '¿Qué significan las siglas MP2.5 y MP10?',
      answer: 'Miden el tamaño de las partículas de contaminación en el aire. MP2.5 son partículas muy finas (como humo) y MP10 son partículas un poco más grandes (como polvo o polen).',
      isOpen: false
    },
    {
      question: '¿Cómo cambio de ubicación o busco otro lugar?',
      answer: 'Toca sobre el nombre de la ubicación actual arriba en la pantalla para abrir el buscador e ingresar otra zona.',
      isOpen: false
    },
    {
      question: '¿Por qué varían los números durante el día?',
      answer: 'La cantidad de contaminación cambia según la hora, el tráfico vehicular, las actividades industriales y las condiciones del clima (como el viento y la temperatura).',
      isOpen: false
    },
    {
      question: '¿Qué muestra la sección "Cambios durante el día"?',
      answer: 'Muestra la medición actual y el pronóstico estimado para las próximas horas del día.',
      isOpen: false
    },
    {
      question: '¿Cómo se lee la hora en el gráfico?',
      answer: 'Cada columna representa una hora específica. La primera casilla corresponde a la hora actual y las siguientes a las horas futuras.',
      isOpen: false
    },
    {
      question: '¿La aplicación detecta mi ubicación automáticamente?',
      answer: 'Sí, si tienes activado el GPS de tu teléfono, la aplicación te mostrará los datos de la estación más cercana a donde te encuentres.',
      isOpen: false
    },
    {
      question: '¿Cómo sé qué ubicación estoy viendo en pantalla?',
      answer: 'El nombre del sector o comuna seleccionada aparece siempre en la parte superior de la pantalla (por ejemplo, "La Farfana").',
      isOpen: false
    }
  ];

  selectedLocation: string = 'La Farfana';
  isDropdownOpen: boolean = false;
  isHelpOpen: boolean = false;

  airData!: AirData;
  allHours: ForecastPeriod[] = [];
  currentStartIndex: number = 0;
  visibleTimeline: ForecastPeriod[] = [];

  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private minSwipeDistance: number = 40;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.generateRandomForecast();
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
    this.cdr.detectChanges();
  }

  toggleHelp(event: MouseEvent) {
    event.stopPropagation();
    this.isHelpOpen = !this.isHelpOpen;
    this.cdr.detectChanges();
  }

  toggleFaq(item: FaqItem, event: MouseEvent) {
    event.stopPropagation();
    item.isOpen = !item.isOpen;
    this.cdr.detectChanges();
  }

  selectLocation(loc: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectedLocation = loc;
    this.isDropdownOpen = false;
    this.generateRandomForecast();
    this.cdr.detectChanges();
  }

  generateRandomForecast() {
    const timeLabels = ['Actual', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
    const possibleLevels = [35, 75, 130];

    this.allHours = timeLabels.map((timeLabel, index) => {
      const baseAqi = index === 0 
        ? Math.floor(Math.random() * (160 - 20 + 1)) + 20 
        : possibleLevels[Math.floor(Math.random() * possibleLevels.length)] + (Math.floor(Math.random() * 20) - 10);

      const aqi = Math.max(15, Math.min(180, baseAqi));
      return this.buildPeriodData(timeLabel, aqi);
    });

    const current = this.allHours[0];
    this.airData = {
      city: this.selectedLocation,
      statusClass: current.statusClass,
      statusText: current.statusText,
      heroIconSrc: current.heroIconSrc,
      pm25: current.pm25,
      pm10: current.pm10,
      recommendations: this.getRecommendations(current.statusText)
    };

    this.currentStartIndex = 0;
    this.updateVisibleTimeline();
  }

  private buildPeriodData(timeLabel: string, aqi: number): ForecastPeriod {
    const pm25 = (aqi * 0.42).toFixed(0);
    const pm10 = (aqi * 0.38).toFixed(0);

    if (aqi <= 50) {
      return {
        timeLabel,
        statusText: 'BUENA',
        statusClass: 'status-good',
        heroIconSrc: 'assets/img/FE.png',
        iconSrc: 'assets/img/smile azul.png',
        pm25,
        pm10
      };
    } else if (aqi <= 100) {
      return {
        timeLabel,
        statusText: 'INTERMEDIA',
        statusClass: 'status-moderate',
        heroIconSrc: 'assets/img/NOR.png',
        iconSrc: 'assets/img/smile amarilla.png',
        pm25,
        pm10
      };
    } else {
      return {
        timeLabel,
        statusText: 'MALA',
        statusClass: 'status-danger',
        heroIconSrc: 'assets/img/TR.png',
        iconSrc: 'assets/img/smile roja.png',
        pm25,
        pm10
      };
    }
  }

  private getRecommendations(status: string): RecommendationItem[] {
    if (status === 'BUENA') {
      return [
        {
          iconSrc: 'assets/img/Sun.png',
          text: '<strong>Es el momento ideal</strong> para salir a caminar, hacer ejercicio o trabajar en el jardín <strong>sin riesgos</strong>.'
        },
        {
          iconSrc: 'assets/img/Group.png',
          text: '<strong>Abre las ventanas</strong> para renovar el aire de la casa, preferentemente durante la mañana.'
        },
        {
          iconSrc: 'assets/img/Tree.png',
          text: '<strong>Aprovecha para visitar parques</strong> o plazas comunitarias de manera segura.'
        }
      ];
    } else if (status === 'INTERMEDIA') {
      return [
        {
          iconSrc: 'assets/img/Heart.png',
          text: 'Si realizas actividades fuera de casa, <strong>reduce la intensidad</strong> y <strong>toma descansos más frecuentes</strong>.'
        },
        {
          iconSrc: 'assets/img/Security.png',
          text: '<strong>Mantén a mano inhaladores</strong> o medicamentos si padeces de asma o problemas respiratorios.'
        },
        {
          iconSrc: 'assets/img/Lock.png',
          text: '<strong>Evita las horas de mayor congestión vehicular</strong> para hacer tus trámites o paseos.'
        }
      ];
    } else {
      return [
        {
          iconSrc: 'assets/img/Home.png',
          text: '<strong>Quédate en casa</strong> y mantén cerradas las ventanas para evitar el ingreso de aire contaminado.'
        },
        {
          iconSrc: 'assets/img/Vector.png',
          text: '<strong>Suspende cualquier actividad exigente</strong> fuera del hogar hasta que los niveles mejoren.'
        },
        {
          iconSrc: 'assets/img/Security.png',
          text: 'Si es indispensable salir, <strong>utiliza una mascarilla</strong> (como N95 o KN95) ajustada al rostro.'
        }
      ];
    }
  }

  updateVisibleTimeline() {
    this.visibleTimeline = this.allHours.slice(this.currentStartIndex, this.currentStartIndex + 3);
    this.cdr.detectChanges();
  }

  slideLeft(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.currentStartIndex > 0) {
      this.currentStartIndex--;
      this.updateVisibleTimeline();
    }
  }

  slideRight(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.currentStartIndex + 3 < this.allHours.length) {
      this.currentStartIndex++;
      this.updateVisibleTimeline();
    }
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipeGesture();
  }

  onMouseDown(event: MouseEvent) {
    this.touchStartX = event.clientX;
  }

  onMouseUp(event: MouseEvent) {
    this.touchEndX = event.clientX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        this.slideRight();
      } else {
        this.slideLeft();
      }
    }
  }
}