export class AnimationManager {
  private intersectionObserver: IntersectionObserver | null = null;

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver(): void {
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver not supported');
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target as HTMLElement);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    this.observeAnimatableElements();
  }

  private observeAnimatableElements(): void {
    if (!this.intersectionObserver) return;

    const animatableElements = document.querySelectorAll(
      '.feature-item, .benefit-item, .category-item, .team-member, .criteria-item'
    );

    animatableElements.forEach(element => {
      this.intersectionObserver?.observe(element);
    });
  }

  private animateElement(element: HTMLElement): void {
    if (element.classList.contains('animated')) return;

    element.classList.add('animated');
    
    // Add specific animations based on element type
    if (element.classList.contains('feature-item')) {
      this.animateFeatureItem(element);
    } else if (element.classList.contains('category-item')) {
      this.animateCategoryItem(element);
    } else if (element.classList.contains('team-member')) {
      this.animateTeamMember(element);
    } else {
      this.animateDefault(element);
    }
  }

  private animateFeatureItem(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  private animateCategoryItem(element: HTMLElement): void {
    const image = element.querySelector('.category-image') as HTMLElement;
    const content = element.querySelector('.category-content') as HTMLElement;

    if (image) {
      image.style.opacity = '0';
      image.style.transform = 'translateX(-50px)';
      image.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    }

    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateX(50px)';
      content.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    }

    requestAnimationFrame(() => {
      if (image) {
        image.style.opacity = '1';
        image.style.transform = 'translateX(0)';
      }
      if (content) {
        content.style.opacity = '1';
        content.style.transform = 'translateX(0)';
      }
    });
  }

  private animateTeamMember(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9) translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1) translateY(0)';
    });
  }

  private animateDefault(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  public animatePageTransition(
    direction: 'in' | 'out',
    element: HTMLElement,
    callback?: () => void
  ): void {
    if (direction === 'out') {
      element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      element.style.opacity = '0';
      element.style.transform = 'translateY(-20px)';
      
      if (callback) {
        setTimeout(callback, 300);
      }
    } else {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        if (callback) {
          setTimeout(callback, 500);
        }
      });
    }
  }

  public createPulseEffect(element: HTMLElement): void {
    element.style.animation = 'pulse 2s infinite';
  }

  public createShakeEffect(element: HTMLElement): void {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  public destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
