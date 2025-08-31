// Import styles
import './styles/main.scss';
import { FloatingDock } from './components/FloatingDock';

// DS Venturists Main Application
class DSVenturists {
    private lastScrollY: number = window.scrollY;
    private dockVisible: boolean = true;
    // Create instance of FloatingDock to handle dock-related functionality
    private readonly floatingDock: FloatingDock;

    constructor() {
        this.floatingDock = new FloatingDock();
        this.init();
        
        // Use the floatingDock instance to set active page
        this.floatingDock.setActivePage('home' as any);
        
        // Expose instance to window for global access
        (window as any).dsvInstance = this;
    }

    private init(): void {
        this.setupEventListeners();
        this.initializeDock();
        this.initializeTeamImages();
        
        // Setup hash-based navigation for mobile
        this.setupHashNavigation();
        
        console.log('DS Venturists application initialized');
    }

    private setupEventListeners(): void {
        // Scroll listener for dock visibility
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Page load listener
        document.addEventListener('DOMContentLoaded', () => {
            this.setInitialDockState();
            this.preloadImages();
        });
    }

    private preloadImages(): void {
        // Preload team images
        const teamImages = [
            'reyaansh.png', 'mahin.jpeg', 'samara.png', 'tanish.jpeg', 
            'vishaka.jpeg', 'hardik.png', 'jiya.png', 'shanaiah.png', 
            'natasha.png', 'samyukta.png', 'dilara.jpeg', 'aashna.jpeg',
            'tanisha.jpeg', 'eleanorr.jpeg', 'vanshika.jpeg'
        ];
        
        teamImages.forEach(img => {
            const image = new Image();
            image.src = img;
        });
    }

    private initializeTeamImages(): void {
        // Fix team member images
        this.updateTeamMemberImage('president', 'reyaansh.png');
        
        // Update team member leader images
        const teamLeaders = [
            { selector: '.team-member.leader:nth-of-type(1)', image: 'mahin.jpeg' },
            { selector: '.team-member.leader:nth-of-type(2)', image: 'samara.png' },
            { selector: '.team-member.leader:nth-of-type(3)', image: 'tanisha.jpeg' },
            { selector: '.team-member.leader:nth-of-type(4)', image: 'vishaka.jpeg' },
            { selector: '.team-member.leader:nth-of-type(5)', image: 'hardik.png' }
        ];
        
        teamLeaders.forEach(leader => {
            const element = document.querySelector(leader.selector);
            if (element) {
                const imgElement = element.querySelector('img');
                if (imgElement) {
                    imgElement.src = leader.image;
                    imgElement.alt = imgElement.alt || 'Team Leader';
                }
            }
        });
    }
    
    private updateTeamMemberImage(role: string, imagePath: string): void {
        const element = document.querySelector(`.team-member.${role} img`);
        if (element instanceof HTMLImageElement) {
            element.src = imagePath;
        }
    }

    private handleScroll(): void {
        const currentScrollY = window.scrollY;
        const dock = document.getElementById('floatingDock');
        
        if (!dock) return;
        
        if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
            // Scrolling down
            if (this.dockVisible) {
                dock.classList.add('hidden');
                this.dockVisible = false;
            }
        } else {
            // Scrolling up
            if (!this.dockVisible) {
                dock.classList.remove('hidden');
                this.dockVisible = true;
            }
        }
        
        this.lastScrollY = currentScrollY;
    }

    private initializeDock(): void {
        // Set initial dock state when page loads
        this.setInitialDockState();
    }

    private setInitialDockState(): void {
        const activePageId = 'home';
        const dockLinks = document.querySelectorAll(`.dock-item[data-page="${activePageId}"]`);
        dockLinks.forEach(link => link.classList.add('active'));
    }
    
    private setupHashNavigation(): void {
        console.log('Setting up hash-based navigation...');
        
        // First, ensure only home page is visible on load
        this.ensureOnlyOnePageVisible('home');
        
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1); // Remove the #
            if (hash) {
                console.log('Hash changed to:', hash);
                this.navigateToPage(hash);
            }
        });
        
        // Handle initial page load
        const initialHash = window.location.hash.substring(1) || 'home';
        console.log('Initial hash:', initialHash);
        this.navigateToPage(initialHash);
        
        // Setup dock toggle for mobile
        setTimeout(() => {
            const dockToggle = document.getElementById('dockToggle');
            if (dockToggle) {
                dockToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleDock();
                });
                
                // Add touch support
                dockToggle.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.toggleDock();
                });
            }

            // Setup click handlers for mobile navigation items (top nav)
            const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
            console.log('Found mobile nav items:', mobileNavItems.length);
            mobileNavItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const pageId = item.getAttribute('data-page');
                    if (pageId) {
                        console.log('Mobile nav clicked:', pageId);
                        this.navigateToPage(pageId);
                        window.location.hash = pageId;
                    }
                });
            });

            // Setup click handlers for dock items (floating menu)
            const dockItems = document.querySelectorAll('.dock-item');
            console.log('Found dock items:', dockItems.length);
            dockItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const pageId = item.getAttribute('data-page');
                    if (pageId) {
                        console.log('Dock item clicked:', pageId);
                        this.navigateToPage(pageId);
                        window.location.hash = pageId;
                        
                        // Close mobile dock after navigation
                        const dockMenu = document.getElementById('dockMenu');
                        if (dockMenu && dockMenu.classList.contains('active')) {
                            this.toggleDock();
                        }
                    }
                });
            });

            console.log('Navigation setup completed');
        }, 500); // Increased delay to ensure DOM is ready
        
        console.log('Hash navigation setup completed');
    }
    
    public ensureOnlyOnePageVisible(activePageId: string): void {
        console.log('Ensuring only one page is visible:', activePageId);
        
        // Get all page sections
        const allPages = document.querySelectorAll('.page-section');
        
        allPages.forEach((page) => {
            const element = page as HTMLElement;
            const pageId = element.id;
            
            if (pageId === activePageId) {
                // Show active page
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.position = 'relative';
                element.style.left = 'auto';
                element.classList.add('active');
                console.log('Showed page:', pageId);
            } else {
                // Hide inactive pages
                element.style.display = 'none';
                element.style.visibility = 'hidden';
                element.style.position = 'absolute';
                element.style.left = '-9999px';
                element.classList.remove('active');
                console.log('Hidden page:', pageId);
            }
        });
    }
    
    private navigateToPage(pageId: string): void {
        console.log('=== NAVIGATION START ===');
        console.log('Target page:', pageId);
        
        try {
            // Ensure only the target page is visible
            this.ensureOnlyOnePageVisible(pageId);
            
            // Update navigation states
            this.updateNavigationStates(pageId);
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            console.log('=== NAVIGATION SUCCESS ===');
        } catch (error) {
            console.error('Navigation error:', error);
            // Fallback to home page
            if (pageId !== 'home') {
                console.log('Falling back to home page');
                this.ensureOnlyOnePageVisible('home');
                this.updateNavigationStates('home');
            }
        }
    }
    
    public updateNavigationStates(activePageId: string): void {
        // Update mobile nav items
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            const pageId = item.getAttribute('data-page');
            if (pageId === activePageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update dock items
        document.querySelectorAll('.dock-item').forEach(item => {
            const pageId = item.getAttribute('data-page');
            if (pageId === activePageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    private toggleDock(): void {
        console.log('Toggling dock...');
        
        const menu = document.getElementById('dockMenu');
        const icon = document.getElementById('dockToggleIcon');
        
        if (menu && icon) {
            menu.classList.toggle('active');
            
            if (menu.classList.contains('active')) {
                icon.className = 'fas fa-times';
                console.log('Dock opened');
            } else {
                icon.className = 'fas fa-bars';
                console.log('Dock closed');
            }
        } else {
            console.error('Dock elements not found');
        }
    }
}

// Global functions for navigation (called from HTML)
declare global {
    interface Window {
        showPage: (pageId: string) => void;
        toggleMobileDock: () => void;
        toggleTeamHierarchy: (team: string) => void;
        closePopup: () => void;
    }
}

// Simplified showPage function
window.showPage = function(pageId: string): void {
    console.log('showPage called with:', pageId);
    
    // Force hide all pages first
    const allPages = document.querySelectorAll('.page-section');
    console.log('Found pages:', allPages.length);
    
    allPages.forEach(page => {
        page.classList.remove('active');
        (page as HTMLElement).style.display = 'none';
        (page as HTMLElement).style.visibility = 'hidden';
        (page as HTMLElement).style.opacity = '0';
    });
    
    // Force show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        targetPage.style.visibility = 'visible';
        targetPage.style.opacity = '1';
        targetPage.style.position = 'relative';
        targetPage.style.left = 'auto';
        console.log('Page shown:', pageId, targetPage);
    } else {
        console.error('Page not found:', pageId);
    }
    
    // Update navigation states
    const dsv = (window as any).dsvInstance;
    if (dsv && dsv.updateNavigationStates) {
        dsv.updateNavigationStates(pageId);
    }
    
    // Close mobile dock if open
    const dockMenu = document.getElementById('dockMenu');
    const dockIcon = document.getElementById('dockToggleIcon');
    if (dockMenu && dockMenu.classList.contains('active')) {
        dockMenu.classList.remove('active');
        if (dockIcon) {
            dockIcon.className = 'fas fa-bars';
        }
    }
    
    // Update hash
    if (window.location.hash.substring(1) !== pageId) {
        history.pushState(null, '', `#${pageId}`);
    }
};

// Mobile dock toggle function
window.toggleMobileDock = function(): void {
    console.log('Toggling mobile dock');
    
    try {
        const menu = document.getElementById('dockMenu');
        const icon = document.getElementById('dockToggleIcon');
        
        if (!menu || !icon) {
            console.error('Dock elements not found');
            return;
        }
        
        menu.classList.toggle('active');
        
        if (menu.classList.contains('active')) {
            icon.className = 'fas fa-times';
            console.log('Dock opened');
        } else {
            icon.className = 'fas fa-bars';
            console.log('Dock closed');
        }
    } catch (error) {
        console.error('Dock toggle error:', error);
    }
};

// Team hierarchy toggle function
window.toggleTeamHierarchy = function(team: string): void {
    // Updated team data with correct images
    const teamData: { [key: string]: any } = {
        tech: {
            title: 'Technical Strategy Team',
            leader: 'Mahin Kashyap',
            leaderImg: 'mahin.jpeg',
            members: [
                { name: 'Tanish Murgan', role: 'Tech Team Member', img: 'tanish.jpeg' },
                { name: 'Pratyush Badrinath', role: 'Tech Team Member', img: 'pratyush.jpg' }
            ]
        },
        pr: {
            title: 'Public Relations Team',
            leader: 'Samara Deshnoor',
            leaderImg: 'samara.png',
            members: [
                { name: 'Samyukta Shanker', role: 'PR Team Member', img: 'samyukta.png' },
                { name: 'Natasha Cardoz', role: 'PR Team Member', img: 'Natasha.png' }
            ]
        },
        category: {
            title: 'Innovation Team',
            leader: 'Tanisha Khanna',
            leaderImg: 'tanisha.jpeg',
            members: [
                { name: 'Eleanor Periera', role: 'Innovation Team Member', img: 'eleanorr.jpeg' },
                { name: 'Vanshika Ahuja', role: 'Innovation Team Member', img: 'vanshika.jpeg' }
            ]
        },
        logistics: {
            title: 'Logistics Team',
            leader: 'Vishaka Nankani',
            leaderImg: 'vishaka.jpeg',
            members: [
                { name: 'Aashna Seth', role: 'Logistics Team Member', img: 'aashna.jpeg' },
                { name: 'Dilara Diyagubadu', role: 'Logistics Team Member', img: 'dilara.jpeg' }
            ]
        },
        marketing: {
            title: 'Marketing Team',
            leader: 'Hardik Kumar',
            leaderImg: 'hardik.png',
            members: [
                { name: 'Jiya Ghai', role: 'Marketing Team Member', img: 'jiya.png' },
                { name: 'Shaniah Francisco', role: 'Marketing Team Member', img: 'shanaiah.png' }
            ]
        }
    };

    if (team === 'president') {
        const leaderBio = document.querySelector('.team-member.president .leader-bio');
        if (leaderBio) {
            leaderBio.classList.toggle('active');
        }
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'team-popup';
    const teamInfo = teamData[team];
    
    // Use actual images instead of placeholders
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-close" onclick="closePopup()">
                <i class="fas fa-times"></i>
            </div>
            <div class="popup-header">
                <div class="member-image">
                    <img src="${teamInfo.leaderImg}" alt="${teamInfo.leader}">
                </div>
                <div class="leader-info">
                    <h2 style="color: var(--accent);">${teamInfo.title}</h2>
                    <p class="role">Led by ${teamInfo.leader}</p>
                </div>
            </div>
            <div class="team-members-grid">
                ${teamInfo.members.map((member: any) => `
                    <div class="team-member">
                        <div class="member-image">
                            <img src="${member.img}" alt="${member.name}">
                        </div>
                        <h3>${member.name}</h3>
                        <p class="role">${member.role}</p>
                        <div class="member-line"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('active'), 10);
};

// Close popup function
window.closePopup = function(): void {
    const popup = document.querySelector('.team-popup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => popup.remove(), 300);
    }
};

// Initialize the application
new DSVenturists();

// Parallax Scroll Component Class
class ParallaxScroll {
    private container: HTMLElement | null = null;
    private images: string[] = [];
    private columns: HTMLElement[] = [];
    private scrollContainer: HTMLElement | null = null;

    constructor(containerId: string, images: string[]) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.init();
    }

    private init(): void {
        if (!this.container) return;
        
        this.createScrollContainer();
        this.createColumns();
        this.distributeImages();
        this.setupParallaxAnimation();
    }

    private createScrollContainer(): void {
        if (!this.container) return;

        this.scrollContainer = document.createElement('div');
        this.scrollContainer.className = 'parallax-scroll-container';
        
        const grid = document.createElement('div');
        grid.className = 'parallax-grid';
        
        this.scrollContainer.appendChild(grid);
        this.container.appendChild(this.scrollContainer);
    }

    private createColumns(): void {
        if (!this.scrollContainer) return;

        const grid = this.scrollContainer.querySelector('.parallax-grid');
        if (!grid) return;

        // Create 3 columns
        for (let i = 0; i < 3; i++) {
            const column = document.createElement('div');
            column.className = `parallax-column parallax-column-${i + 1}`;
            grid.appendChild(column);
            this.columns.push(column);
        }
    }

    private distributeImages(): void {
        const third = Math.ceil(this.images.length / 3);
        const firstPart = this.images.slice(0, third);
        const secondPart = this.images.slice(third, 2 * third);
        const thirdPart = this.images.slice(2 * third);

        const imageParts = [firstPart, secondPart, thirdPart];

        imageParts.forEach((part, columnIndex) => {
            part.forEach((imageSrc, imageIndex) => {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'parallax-image-container';

                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = `Parallax image ${columnIndex + 1}-${imageIndex + 1}`;
                img.className = 'parallax-image';
                img.loading = 'lazy';

                // Add click handler for lightbox
                imageContainer.addEventListener('click', () => {
                    this.openLightbox(imageSrc);
                });

                imageContainer.appendChild(img);
                if (this.columns[columnIndex]) {
                    this.columns[columnIndex].appendChild(imageContainer);
                }
            });
        });
    }

    private setupParallaxAnimation(): void {
        if (!this.scrollContainer || typeof window === 'undefined' || !(window as any).gsap) return;

        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;

        // Initialize ScrollTrigger if available
        if (ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Get columns
        const column1 = this.columns[0];
        const column2 = this.columns[1];
        const column3 = this.columns[2];

        if (!column1 || !column2 || !column3) return;

        // Parallax animation for first column (moves up and left)
        gsap.to(column1, {
            y: -200,
            x: -50,
            rotation: -5,
            scrollTrigger: {
                trigger: this.scrollContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        // Second column stays relatively static
        gsap.to(column2, {
            y: -50,
            scrollTrigger: {
                trigger: this.scrollContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        // Third column moves in opposite direction
        gsap.to(column3, {
            y: -200,
            x: 50,
            rotation: 5,
            scrollTrigger: {
                trigger: this.scrollContainer,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        // Add stagger animation on scroll
        const images = this.scrollContainer.querySelectorAll('.parallax-image-container');
        gsap.fromTo(images, 
            { 
                opacity: 0,
                y: 50,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: this.scrollContainer,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    private openLightbox(imageSrc: string): void {
        // Use existing MediaGallery lightbox if available
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage') as HTMLImageElement;
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = imageSrc;
            lightboxImage.alt = 'Parallax image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    public updateImages(newImages: string[]): void {
        this.images = newImages;
        
        // Clear existing columns
        this.columns.forEach(column => {
            column.innerHTML = '';
        });
        
        // Redistribute images
        this.distributeImages();
        this.setupParallaxAnimation();
    }
}

// Media Gallery implementation continues from AnimationManager
class MediaGallery {
    private lightbox: HTMLElement | null = null;
    private lightboxImage: HTMLImageElement | null = null;
    private currentImageIndex: number = 0;
    private images: NodeListOf<HTMLImageElement> | null = null;
    private parallaxScroll: ParallaxScroll | null = null;

    constructor() {
        this.init();
    }

    private init(): void {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupGallery());
        } else {
            this.setupGallery();
        }
    }

    private setupGallery(): void {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage') as HTMLImageElement;
        this.images = document.querySelectorAll('.gallery-item img');

        // Setup Parallax Scroll with your event images
        this.setupParallaxScroll();

        // Setup gallery item click handlers
        this.images.forEach((img, index) => {
            const galleryItem = img.closest('.gallery-item') as HTMLElement;
            if (galleryItem) {
                galleryItem.addEventListener('click', () => this.openLightbox(index));
            }
        });

        // Setup lightbox controls
        this.setupLightboxControls();

        // Setup Instagram link
        this.setupInstagramLink();
    }

    private setupParallaxScroll(): void {
        // Your DS Venturists event images for parallax effect
        const parallaxImages = [
            'DSV 2023-275.jpg',
            'DSV 2023-359.jpg', 
            'DSV 2023-388.jpg',
            'DSV-100.png',
            'DSV-101.png',
            'DSV-102.png',
            'IMG_1587.JPG',
            'IMG_1765.JPG',
            'IMG_8958.JPG',
            'Den.jpeg',
            'Brainbrawl.png',
            'Advert.jpeg',
            'DSV 2023-275.jpg',
            'DSV 2023-359.jpg',
            'DSV 2023-388.jpg',
            'DSV-100.png',
            'DSV-101.png',
            'DSV-102.png',
            'IMG_1587.JPG',
            'IMG_1765.JPG',
            'IMG_8958.JPG',
            'Den.jpeg',
            'Brainbrawl.png',
            'Advert.jpeg'
        ];

        // Initialize parallax scroll
        this.parallaxScroll = new ParallaxScroll('parallaxContainer', parallaxImages);
        
        if (this.parallaxScroll) {
            console.log('Parallax scroll initialized successfully');
        }
    }

    private setupLightboxControls(): void {
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeLightbox());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }

        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.closeLightbox();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (this.lightbox?.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }

    private setupInstagramLink(): void {
        const instagramLink = document.getElementById('instagramLink');
        if (instagramLink) {
            // Remove any existing click handlers that might prevent navigation
            instagramLink.addEventListener('click', () => {
                // Allow the default link behavior to proceed
                console.log('Instagram link clicked - navigating to Instagram');
            });
        }
    }

    private openLightbox(index: number): void {
        if (!this.lightbox || !this.lightboxImage || !this.images) return;

        this.currentImageIndex = index;
        const selectedImage = this.images[index];
        
        if (selectedImage) {
            this.lightboxImage.src = selectedImage.src;
            this.lightboxImage.alt = selectedImage.alt;
        }
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.updateNavigationButtons();
    }

    private closeLightbox(): void {
        if (!this.lightbox) return;

        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    private previousImage(): void {
        if (!this.images) return;

        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.images.length - 1;
        
        this.updateLightboxImage();
    }

    private nextImage(): void {
        if (!this.images) return;

        this.currentImageIndex = this.currentImageIndex < this.images.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        
        this.updateLightboxImage();
    }

    private updateLightboxImage(): void {
        if (!this.lightboxImage || !this.images) return;

        const currentImage = this.images[this.currentImageIndex];
        if (currentImage) {
            this.lightboxImage.src = currentImage.src;
            this.lightboxImage.alt = currentImage.alt;
        }

        this.updateNavigationButtons();
    }

    private updateNavigationButtons(): void {
        const prevBtn = document.getElementById('lightboxPrev') as HTMLButtonElement;
        const nextBtn = document.getElementById('lightboxNext') as HTMLButtonElement;

        if (!this.images || !prevBtn || !nextBtn) return;

        prevBtn.disabled = false;
        nextBtn.disabled = false;

        prevBtn.style.opacity = this.currentImageIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentImageIndex === this.images.length - 1 ? '0.5' : '1';
    }
}

// Initialize Media Gallery
new MediaGallery();

// Force show home page on load
setTimeout(() => {
    console.log('Force showing home page');
    window.showPage('home');
}, 100);
