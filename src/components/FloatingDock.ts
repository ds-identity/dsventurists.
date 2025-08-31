import { DockConfig, PageId } from '../types/index';

export class FloatingDock {
  private config: DockConfig = {
    isVisible: true,
    isMobile: false,
    isMenuOpen: false,
  };

  private lastScrollY: number = window.scrollY;
  private dockElement: HTMLElement | null = null;
  private mobileDockElement: HTMLElement | null = null;
  private mobileMenuElement: HTMLElement | null = null;

  constructor() {
    this.initializeDock();
    this.bindEvents();
    this.checkMobileState();
  }

  private initializeDock(): void {
    // Match the actual HTML IDs and classes
    this.dockElement = document.getElementById('floatingDock');
    this.mobileDockElement = document.querySelector('.floating-dock-mobile');
    this.mobileMenuElement = document.getElementById('dockMenu');
    
    if (!this.dockElement || !this.mobileDockElement) {
      console.error('Dock elements not found');
      return;
    }
  }

  private bindEvents(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Mobile dock toggle
    const toggleButton = document.querySelector('.dock-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', this.toggleMobileDock.bind(this));
    }

    // Dock item hover effects
    this.setupHoverEffects();
  }

  private checkMobileState(): void {
    this.config.isMobile = window.innerWidth <= 768;
    this.updateDockVisibility();
  }

  private handleResize(): void {
    this.checkMobileState();
  }

  private handleScroll(): void {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down
      this.hideDock();
    } else {
      // Scrolling up
      this.showDock();
    }
    
    this.lastScrollY = currentScrollY;
  }

  private hideDock(): void {
    if (!this.config.isVisible || !this.dockElement) return;
    
    this.config.isVisible = false;
    this.dockElement.classList.add('hidden');
  }

  private showDock(): void {
    if (this.config.isVisible || !this.dockElement) return;
    
    this.config.isVisible = true;
    this.dockElement.classList.remove('hidden');
  }

  private updateDockVisibility(): void {
    if (!this.dockElement || !this.mobileDockElement) return;

    if (this.config.isMobile) {
      // Keep both visible but adjust styles appropriately for mobile
      this.dockElement.style.display = 'none';
      this.mobileDockElement.style.display = 'block';
    } else {
      this.dockElement.style.display = 'flex';
      this.mobileDockElement.style.display = 'none';
    }
  }

  public toggleMobileDock(): void {
    if (!this.mobileMenuElement) return;

    this.config.isMenuOpen = !this.config.isMenuOpen;
    this.mobileMenuElement.classList.toggle('active');
    
    const toggleIcon = document.getElementById('dockToggleIcon');
    if (toggleIcon) {
      toggleIcon.className = this.config.isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  }

  public setActivePage(pageId: PageId): void {
    // Update all dock items in both desktop and mobile docks
    document.querySelectorAll('.dock-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      }
    });
  }

  private setupHoverEffects(): void {
    const dockItems = document.querySelectorAll('#floatingDock .dock-item');
    
    dockItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768) return; // Skip effects on mobile
        
        const siblings = Array.from(item.parentElement?.children || []) as HTMLElement[];
        const itemIndex = siblings.indexOf(item as HTMLElement);
        
        siblings.forEach((sibling, i) => {
          const distance = Math.abs(i - itemIndex);
          if (distance === 1) {
            sibling.style.transform = 'translateY(-5px) scale(1.1)';
          } else if (distance === 2) {
            sibling.style.transform = 'translateY(-2px) scale(1.05)';
          }
        });
      });
      
      item.addEventListener('mouseleave', () => {
        const siblings = Array.from(item.parentElement?.children || []) as HTMLElement[];
        siblings.forEach(sibling => {
          if (sibling !== item) {
            sibling.style.transform = '';
          }
        });
      });
    });
  }

  public closeMobileDock(): void {
    if (!this.config.isMenuOpen) return;
    this.toggleMobileDock();
  }
}
