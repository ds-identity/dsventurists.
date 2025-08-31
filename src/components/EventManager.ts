import { Event } from '../types';

export class EventManager {
  private events: Event[] = [
    {
      id: 'online-business-model',
      title: 'Online Business Model Challenge',
      description: 'Create and pitch a digital business model that solves real-world problems',
      date: '2024-02-15',
      status: 'upcoming',
      registrationLink: '#register',
      image: '/images/online-business.jpg',
      details: {
        duration: '2 weeks',
        format: 'Virtual presentation',
        prizes: ['₹50,000', '₹30,000', '₹20,000'],
        requirements: ['Business plan', 'Financial projections', '10-minute pitch']
      }
    },
    {
      id: 'startup-pitch',
      title: 'Startup Pitch Competition',
      description: 'Present your startup idea to industry experts and investors',
      date: '2024-03-01',
      status: 'upcoming',
      registrationLink: '#register',
      image: '/images/startup-pitch.jpg',
      details: {
        duration: '1 day',
        format: 'In-person presentation',
        prizes: ['₹1,00,000', '₹60,000', '₹40,000'],
        requirements: ['Prototype/MVP', 'Market research', '15-minute pitch + Q&A']
      }
    },
    {
      id: 'innovation-hackathon',
      title: 'Innovation Hackathon',
      description: '48-hour intensive development of innovative solutions',
      date: '2024-03-15',
      status: 'upcoming',
      registrationLink: '#register',
      image: '/images/hackathon.jpg',
      details: {
        duration: '48 hours',
        format: 'Team-based development',
        prizes: ['₹75,000', '₹45,000', '₹30,000'],
        requirements: ['Working prototype', 'Technical documentation', 'Demo presentation']
      }
    }
  ];

  private currentEventIndex = 0;
  private container: HTMLElement | null = null;
  private autoScrollInterval: number | null = null;

  constructor() {
    this.initializeEventDisplay();
    this.setupEventHandlers();
  }

  private initializeEventDisplay(): void {
    this.container = document.getElementById('events-container');
    if (!this.container) return;

    this.renderEvents();
    this.startAutoScroll();
  }

  private renderEvents(): void {
    if (!this.container) return;

    this.container.innerHTML = this.events.map((event, index) => `
      <div class="event-item ${index === this.currentEventIndex ? 'active' : ''}" 
           data-event-id="${event.id}">
        <div class="event-image">
          <img src="${event.image}" alt="${event.title}" loading="lazy">
          <div class="event-status ${event.status}">${event.status}</div>
        </div>
        <div class="event-content">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-description">${event.description}</p>
          <div class="event-meta">
            <span class="event-date">
              <i class="icon-calendar"></i>
              ${this.formatDate(event.date)}
            </span>
            <span class="event-duration">
              <i class="icon-clock"></i>
              ${event.details.duration}
            </span>
          </div>
          <div class="event-prizes">
            <h4>Prize Pool:</h4>
            <div class="prize-list">
              ${event.details.prizes.map((prize: string, i: number) => `
                <span class="prize-item rank-${i + 1}">${prize}</span>
              `).join('')}
            </div>
          </div>
          <div class="event-actions">
            <button class="btn btn-primary register-btn" 
                    data-event-id="${event.id}">
              Register Now
            </button>
            <button class="btn btn-secondary details-btn" 
                    data-event-id="${event.id}">
              View Details
            </button>
          </div>
        </div>
      </div>
    `).join('');

    this.addEventIndicators();
  }

  private addEventIndicators(): void {
    const indicatorsContainer = document.querySelector('.event-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = this.events.map((_, index) => `
      <button class="event-indicator ${index === this.currentEventIndex ? 'active' : ''}" 
              data-index="${index}">
        <span class="sr-only">Event ${index + 1}</span>
      </button>
    `).join('');
  }

  private setupEventHandlers(): void {
    // Register button handlers
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('register-btn')) {
        const eventId = target.getAttribute('data-event-id');
        if (eventId) this.handleRegistration(eventId);
      }
      
      if (target.classList.contains('details-btn')) {
        const eventId = target.getAttribute('data-event-id');
        if (eventId) this.showEventDetails(eventId);
      }
      
      if (target.classList.contains('event-indicator')) {
        const index = parseInt(target.getAttribute('data-index') || '0');
        this.navigateToEvent(index);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.activeElement?.closest('.events-section')) {
        if (e.key === 'ArrowLeft') {
          this.previousEvent();
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          this.nextEvent();
          e.preventDefault();
        }
      }
    });

    // Pause auto-scroll on hover
    if (this.container) {
      this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
      this.container.addEventListener('mouseleave', () => this.resumeAutoScroll());
    }
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private handleRegistration(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    // Trigger registration modal or navigation
    const customEvent = new CustomEvent('eventRegistration', {
      detail: { event }
    });
    document.dispatchEvent(customEvent);
  }

  private showEventDetails(eventId: string): void {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;

    this.createEventDetailsModal(event);
  }

  private createEventDetailsModal(event: Event): void {
    const modal = document.createElement('div');
    modal.className = 'event-details-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-header">
          <img src="${event.image}" alt="${event.title}">
          <h2>${event.title}</h2>
        </div>
        <div class="modal-body">
          <p class="event-description">${event.description}</p>
          
          <div class="event-info-grid">
            <div class="info-item">
              <h4>Date</h4>
              <p>${this.formatDate(event.date)}</p>
            </div>
            <div class="info-item">
              <h4>Duration</h4>
              <p>${event.details.duration}</p>
            </div>
            <div class="info-item">
              <h4>Format</h4>
              <p>${event.details.format}</p>
            </div>
          </div>

          <div class="prizes-section">
            <h4>Prizes</h4>
            <div class="prize-breakdown">
              ${event.details.prizes.map((prize: string, i: number) => `
                <div class="prize-item">
                  <span class="rank">${['🥇', '🥈', '🥉'][i] || '🏆'} ${this.getOrdinal(i + 1)} Place</span>
                  <span class="amount">${prize}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="requirements-section">
            <h4>Requirements</h4>
            <ul class="requirements-list">
              ${event.details.requirements.map((req: string) => `
                <li><i class="icon-check"></i> ${req}</li>
              `).join('')}
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" data-event-id="${event.id}">
            Register for this Event
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const registerBtn = modal.querySelector('.btn-primary');

    const closeModal = () => {
      modal.remove();
    };

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
    registerBtn?.addEventListener('click', () => {
      this.handleRegistration(event.id);
      closeModal();
    });

    // Escape key handler
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);

    // Animate modal in
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });
  }

  private getOrdinal(num: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = num % 100;
    return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0] || 'th');
  }

  private nextEvent(): void {
    this.currentEventIndex = (this.currentEventIndex + 1) % this.events.length;
    this.updateEventDisplay();
  }

  private previousEvent(): void {
    this.currentEventIndex = this.currentEventIndex === 0 
      ? this.events.length - 1 
      : this.currentEventIndex - 1;
    this.updateEventDisplay();
  }

  private navigateToEvent(index: number): void {
    this.currentEventIndex = index;
    this.updateEventDisplay();
    this.resetAutoScroll();
  }

  private updateEventDisplay(): void {
    if (!this.container) return;

    const eventItems = this.container.querySelectorAll('.event-item');
    const indicators = document.querySelectorAll('.event-indicator');

    eventItems.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentEventIndex);
    });

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentEventIndex);
    });
  }

  private startAutoScroll(): void {
    this.autoScrollInterval = window.setInterval(() => {
      this.nextEvent();
    }, 5000);
  }

  private pauseAutoScroll(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }

  private resumeAutoScroll(): void {
    if (!this.autoScrollInterval) {
      this.startAutoScroll();
    }
  }

  private resetAutoScroll(): void {
    this.pauseAutoScroll();
    this.resumeAutoScroll();
  }

  public addEvent(event: Event): void {
    this.events.push(event);
    this.renderEvents();
  }

  public updateEvent(eventId: string, updates: Partial<Event>): void {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      this.events[eventIndex] = { ...this.events[eventIndex], ...updates } as Event;
      this.renderEvents();
    }
  }

  public getEventById(eventId: string): Event | undefined {
    return this.events.find(e => e.id === eventId);
  }

  public destroy(): void {
    this.pauseAutoScroll();
    document.removeEventListener('click', this.setupEventHandlers);
    document.removeEventListener('keydown', this.setupEventHandlers);
  }
}
