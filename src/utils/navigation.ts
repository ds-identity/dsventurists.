import { PageId, NavigationState, AnimationConfig } from '../types/index';

export class NavigationManager {
  private state: NavigationState = {
    currentPage: 'home',
    previousPage: null,
    isTransitioning: false,
  };

  private animationConfig: AnimationConfig = {
    duration: 500,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  constructor() {
    this.bindEvents();
    this.initializePage();
  }

  private bindEvents(): void {
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  private initializePage(): void {
    const hash = window.location.hash.slice(1) as PageId;
    if (hash && this.isValidPageId(hash)) {
      this.showPage(hash, false);
    } else {
      this.showPage('home', false);
    }
  }

  private handlePopState(): void {
    const hash = window.location.hash.slice(1) as PageId;
    if (hash && this.isValidPageId(hash)) {
      this.showPage(hash, false);
    }
  }

  private isValidPageId(pageId: string): pageId is PageId {
    const validPages: PageId[] = ['home', 'previous-events', 'categories', 'register', 'team'];
    return validPages.includes(pageId as PageId);
  }

  public showPage(pageId: PageId, updateHistory: boolean = true): void {
    if (this.state.isTransitioning || pageId === this.state.currentPage) {
      return;
    }

    this.state.isTransitioning = true;
    
    if (updateHistory) {
      window.history.pushState(null, '', `#${pageId}`);
    }

    const currentPage = document.querySelector('.page-section.active') as HTMLElement;
    const newPage = document.getElementById(pageId) as HTMLElement;

    if (!newPage) {
      console.error(`Page with id "${pageId}" not found`);
      this.state.isTransitioning = false;
      return;
    }

    const direction = this.getTransitionDirection(pageId);

    this.animatePageTransition(currentPage, newPage, direction)
      .then(() => {
        this.updateNavigationState(pageId);
        this.updateActiveElements(pageId);
        this.state.isTransitioning = false;
      })
      .catch(error => {
        console.error('Page transition failed:', error);
        this.state.isTransitioning = false;
      });
  }

  private getTransitionDirection(newPageId: PageId): 'left' | 'right' {
    const pageOrder: PageId[] = ['home', 'previous-events', 'categories', 'register', 'team'];
    const currentIndex = pageOrder.indexOf(this.state.currentPage as PageId);
    const newIndex = pageOrder.indexOf(newPageId);
    return newIndex > currentIndex ? 'right' : 'left';
  }

  private animatePageTransition(
    currentPage: HTMLElement | null,
    newPage: HTMLElement,
    direction: 'left' | 'right'
  ): Promise<void> {
    return new Promise((resolve) => {
      const exitTransform = direction === 'right' ? 'translateX(-100%)' : 'translateX(100%)';
      const enterTransform = direction === 'right' ? 'translateX(100%)' : 'translateX(-100%)';

      // Animate current page out
      if (currentPage) {
        currentPage.style.transition = `transform ${this.animationConfig.duration}ms ${this.animationConfig.easing}, opacity ${this.animationConfig.duration}ms ${this.animationConfig.easing}`;
        currentPage.style.transform = exitTransform;
        currentPage.style.opacity = '0';

        setTimeout(() => {
          currentPage.classList.remove('active');
          currentPage.style.display = 'none';
          currentPage.style.transform = '';
          currentPage.style.opacity = '';
          currentPage.style.transition = '';
        }, this.animationConfig.duration);
      }

      // Animate new page in
      newPage.style.display = 'block';
      newPage.style.transform = enterTransform;
      newPage.style.opacity = '0';
      newPage.style.transition = `transform ${this.animationConfig.duration}ms ${this.animationConfig.easing}, opacity ${this.animationConfig.duration}ms ${this.animationConfig.easing}`;

      requestAnimationFrame(() => {
        newPage.classList.add('active');
        newPage.style.transform = 'translateX(0)';
        newPage.style.opacity = '1';

        setTimeout(() => {
          newPage.style.transition = '';
          window.scrollTo(0, 0);
          resolve();
        }, this.animationConfig.duration);
      });
    });
  }

  private updateNavigationState(pageId: PageId): void {
    this.state.previousPage = this.state.currentPage;
    this.state.currentPage = pageId;
  }

  private updateActiveElements(pageId: PageId): void {
    // Update dock navigation
    document.querySelectorAll('.dock-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-page') === pageId) {
        item.classList.add('active');
      }
    });

    // Update any other navigation elements
    document.querySelectorAll('[data-nav-target]').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-nav-target') === pageId) {
        item.classList.add('active');
      }
    });
  }

  public getCurrentPage(): PageId {
    return this.state.currentPage as PageId;
  }

  public getPreviousPage(): PageId | null {
    return this.state.previousPage as PageId | null;
  }

  public isTransitioning(): boolean {
    return this.state.isTransitioning;
  }
}
