import { Category } from '../types';

export class CategoryManager {
  private categories: Category[] = [
    {
      id: 'business-plan',
      name: 'Business Plan Competition',
      description: 'Develop a comprehensive business plan for an innovative venture',
      image: '/images/business-plan.jpg',
      teamSize: { min: 2, max: 4 },
      rules: [
        'Teams must consist of 2-4 members',
        'Business plan must be original and innovative',
        'Financial projections for 3 years required',
        'Market research documentation mandatory',
        'Presentation time: 15 minutes + 5 minutes Q&A'
      ]
    },
    {
      id: 'startup-pitch',
      name: 'Startup Pitch Challenge',
      description: 'Present your startup idea with a working prototype or MVP',
      image: '/images/startup.jpg',
      teamSize: { min: 1, max: 5 },
      rules: [
        'Minimum viable product (MVP) required',
        'Teams can have 1-5 members',
        'Pitch duration: 10 minutes + 5 minutes Q&A',
        'Technical demonstration mandatory',
        'User validation data preferred'
      ]
    },
    {
      id: 'social-innovation',
      name: 'Social Innovation Track',
      description: 'Create solutions that address pressing social or environmental challenges',
      image: '/images/social-innovation.jpg',
      teamSize: { min: 2, max: 6 },
      rules: [
        'Solution must address a social/environmental issue',
        'Teams of 2-6 members allowed',
        'Impact measurement plan required',
        'Sustainability model necessary',
        'Community engagement evidence valued'
      ]
    },
    {
      id: 'tech-innovation',
      name: 'Technology Innovation',
      description: 'Develop cutting-edge technology solutions for real-world problems',
      image: '/images/tech-innovation.jpg',
      teamSize: { min: 2, max: 4 },
      rules: [
        'Technical innovation must be demonstrable',
        'Teams of 2-4 members',
        'Code/technical documentation required',
        'Scalability analysis needed',
        'Intellectual property considerations addressed'
      ]
    }
  ];

  private selectedCategory: string | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.initializeCategoryDisplay();
    this.setupEventHandlers();
  }

  private initializeCategoryDisplay(): void {
    this.container = document.getElementById('categories-container');
    if (!this.container) return;

    this.renderCategories();
  }

  private renderCategories(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="categories-grid">
        ${this.categories.map(category => `
          <div class="category-card" data-category-id="${category.id}">
            <div class="category-image">
              <img src="${category.image}" alt="${category.name}" loading="lazy">
              <div class="category-overlay">
                <button class="btn btn-primary learn-more" data-category-id="${category.id}">
                  Learn More
                </button>
              </div>
            </div>
            <div class="category-content">
              <h3 class="category-title">${category.name}</h3>
              <p class="category-description">${category.description}</p>
              <div class="category-meta">
                <span class="team-size">
                  <i class="icon-users"></i>
                  Team Size: ${category.teamSize.min}-${category.teamSize.max} members
                </span>
              </div>
              <div class="category-actions">
                <button class="btn btn-outline register-category" 
                        data-category-id="${category.id}">
                  Register for this Category
                </button>
                <button class="btn btn-text view-rules" 
                        data-category-id="${category.id}">
                  View Rules
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private setupEventHandlers(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('learn-more')) {
        const categoryId = target.getAttribute('data-category-id');
        if (categoryId) this.showCategoryDetails(categoryId);
      }
      
      if (target.classList.contains('register-category')) {
        const categoryId = target.getAttribute('data-category-id');
        if (categoryId) this.handleCategoryRegistration(categoryId);
      }
      
      if (target.classList.contains('view-rules')) {
        const categoryId = target.getAttribute('data-category-id');
        if (categoryId) this.showCategoryRules(categoryId);
      }
    });

    // Keyboard navigation for accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as HTMLElement;
        if (target.classList.contains('category-card')) {
          const categoryId = target.getAttribute('data-category-id');
          if (categoryId) {
            this.showCategoryDetails(categoryId);
            e.preventDefault();
          }
        }
      }
    });
  }

  private showCategoryDetails(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return;

    this.createCategoryModal(category);
  }

  private createCategoryModal(category: Category): void {
    const modal = document.createElement('div');
    modal.className = 'category-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content large">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-header">
          <img src="${category.image}" alt="${category.name}" class="category-hero">
          <div class="category-header-content">
            <h2>${category.name}</h2>
            <p class="category-tagline">${category.description}</p>
          </div>
        </div>
        <div class="modal-body">
          <div class="category-details-grid">
            <div class="detail-section">
              <h3><i class="icon-users"></i> Team Requirements</h3>
              <div class="team-info">
                <p><strong>Team Size:</strong> ${category.teamSize.min} to ${category.teamSize.max} members</p>
                <p><strong>Composition:</strong> Mixed skills encouraged (business, technical, creative)</p>
                <p><strong>Leadership:</strong> One team captain required for communication</p>
              </div>
            </div>

            <div class="detail-section">
              <h3><i class="icon-list"></i> Competition Rules</h3>
              <ul class="rules-list">
                ${category.rules?.map(rule => `
                  <li><i class="icon-check-circle"></i> ${rule}</li>
                `).join('') || '<li>Rules will be announced soon</li>'}
              </ul>
            </div>

            <div class="detail-section">
              <h3><i class="icon-trophy"></i> Judging Criteria</h3>
              <div class="criteria-grid">
                ${this.getJudgingCriteria(category.id).map(criterion => `
                  <div class="criterion-item">
                    <div class="criterion-weight">${criterion.weight}%</div>
                    <div class="criterion-content">
                      <h4>${criterion.name}</h4>
                      <p>${criterion.description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="detail-section">
              <h3><i class="icon-calendar"></i> Timeline</h3>
              <div class="timeline">
                ${this.getTimeline(category.id).map(phase => `
                  <div class="timeline-item">
                    <div class="timeline-date">${phase.date}</div>
                    <div class="timeline-content">
                      <h4>${phase.title}</h4>
                      <p>${phase.description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary register-btn" data-category-id="${category.id}">
            Register for ${category.name}
          </button>
          <button class="btn btn-secondary download-guidelines" data-category-id="${category.id}">
            Download Guidelines
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const registerBtn = modal.querySelector('.register-btn');
    const downloadBtn = modal.querySelector('.download-guidelines');

    const closeModal = () => {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);
    
    registerBtn?.addEventListener('click', () => {
      this.handleCategoryRegistration(category.id);
      closeModal();
    });
    
    downloadBtn?.addEventListener('click', () => {
      this.downloadGuidelines(category.id);
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

  private getJudgingCriteria(categoryId: string): Array<{name: string; weight: number; description: string}> {
    const criteriaMap: Record<string, Array<{name: string; weight: number; description: string}>> = {
      'business-plan': [
        {
          name: 'Innovation & Uniqueness',
          weight: 25,
          description: 'Originality of the business idea and its differentiation from existing solutions'
        },
        {
          name: 'Market Viability',
          weight: 25,
          description: 'Market size, target audience analysis, and commercial potential'
        },
        {
          name: 'Financial Projections',
          weight: 20,
          description: 'Realistic financial planning and revenue model sustainability'
        },
        {
          name: 'Implementation Plan',
          weight: 20,
          description: 'Feasibility and clarity of execution strategy'
        },
        {
          name: 'Presentation Quality',
          weight: 10,
          description: 'Clarity, professionalism, and persuasiveness of the pitch'
        }
      ],
      'startup-pitch': [
        {
          name: 'Product Innovation',
          weight: 30,
          description: 'Technical innovation and uniqueness of the solution'
        },
        {
          name: 'Market Validation',
          weight: 25,
          description: 'Evidence of user need and market demand'
        },
        {
          name: 'MVP Quality',
          weight: 20,
          description: 'Functionality and user experience of the prototype'
        },
        {
          name: 'Scalability',
          weight: 15,
          description: 'Potential for growth and expansion'
        },
        {
          name: 'Pitch Delivery',
          weight: 10,
          description: 'Communication skills and presentation effectiveness'
        }
      ],
      'social-innovation': [
        {
          name: 'Social Impact',
          weight: 35,
          description: 'Potential to create meaningful positive change'
        },
        {
          name: 'Sustainability',
          weight: 25,
          description: 'Long-term viability and environmental considerations'
        },
        {
          name: 'Community Engagement',
          weight: 20,
          description: 'Involvement and support from target communities'
        },
        {
          name: 'Innovation',
          weight: 15,
          description: 'Creative approach to addressing social challenges'
        },
        {
          name: 'Implementation Plan',
          weight: 5,
          description: 'Realistic execution strategy and measurable outcomes'
        }
      ],
      'tech-innovation': [
        {
          name: 'Technical Excellence',
          weight: 30,
          description: 'Quality of technology and engineering innovation'
        },
        {
          name: 'Problem Solving',
          weight: 25,
          description: 'Effectiveness in addressing real-world challenges'
        },
        {
          name: 'Scalability & Performance',
          weight: 20,
          description: 'System efficiency and potential for scale'
        },
        {
          name: 'Market Application',
          weight: 15,
          description: 'Commercial viability and market readiness'
        },
        {
          name: 'Code Quality',
          weight: 10,
          description: 'Documentation, testing, and maintainability'
        }
      ]
    };

    return criteriaMap[categoryId] || [];
  }

  private getTimeline(_categoryId: string): Array<{date: string; title: string; description: string}> {
    return [
      {
        date: 'Feb 1',
        title: 'Registration Opens',
        description: 'Team registration and category selection begins'
      },
      {
        date: 'Feb 15',
        title: 'Registration Closes',
        description: 'Final deadline for team submissions'
      },
      {
        date: 'Feb 20',
        title: 'Initial Review',
        description: 'Preliminary evaluation and feedback session'
      },
      {
        date: 'Mar 1',
        title: 'Development Phase',
        description: 'Teams work on their projects with mentor support'
      },
      {
        date: 'Mar 15',
        title: 'Final Presentations',
        description: 'Live pitches to judges and audience'
      },
      {
        date: 'Mar 16',
        title: 'Awards Ceremony',
        description: 'Winner announcements and networking event'
      }
    ];
  }

  private showCategoryRules(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return;

    // Create a simpler rules modal
    const modal = document.createElement('div');
    modal.className = 'rules-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-header">
          <h2>Rules for ${category.name}</h2>
        </div>
        <div class="modal-body">
          <ul class="rules-list">
            ${category.rules?.map(rule => `
              <li><i class="icon-check"></i> ${rule}</li>
            `).join('') || '<li>Rules will be announced soon</li>'}
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary">Got It!</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Simple close handlers
    const closeModal = () => modal.remove();
    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    modal.querySelector('.btn-primary')?.addEventListener('click', closeModal);

    // Show modal
    requestAnimationFrame(() => modal.classList.add('show'));
  }

  private handleCategoryRegistration(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return;

    // Dispatch custom event for registration
    const customEvent = new CustomEvent('categoryRegistration', {
      detail: { category }
    });
    document.dispatchEvent(customEvent);
  }

  private downloadGuidelines(_categoryId: string): void {
    // In a real application, this would trigger a download
    // For now, we'll show a notification
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
      <i class="icon-download"></i>
      Guidelines download will be available soon!
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  public selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    
    // Update UI to show selected state
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      const cardId = card.getAttribute('data-category-id');
      card.classList.toggle('selected', cardId === categoryId);
    });
  }

  public getSelectedCategory(): string | null {
    return this.selectedCategory;
  }

  public getCategoryById(categoryId: string): Category | undefined {
    return this.categories.find(c => c.id === categoryId);
  }

  public getAllCategories(): Category[] {
    return [...this.categories];
  }

  public addCategory(category: Category): void {
    this.categories.push(category);
    this.renderCategories();
  }

  public updateCategory(categoryId: string, updates: Partial<Category>): void {
    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex !== -1) {
      this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...updates } as Category;
      this.renderCategories();
    }
  }

  public destroy(): void {
    // Clean up event listeners if needed
    this.selectedCategory = null;
  }
}
