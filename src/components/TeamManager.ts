import { Team } from '../types/index';

export class TeamManager {
  private teams: Team[] = [];
  private popupElement: HTMLElement | null = null;

  constructor() {
    this.initializeTeams();
    this.bindEvents();
  }

  private initializeTeams(): void {
    this.teams = [
      {
        id: 'tech',
        title: 'Technical Strategy Team',
        leader: {
          id: 'mahin',
          name: 'Mahin Kashyap',
          role: 'Chief Tech Strategist',
          image: 'mahin.jpeg',
          isLeader: true,
          team: 'tech'
        },
        members: [
          {
            id: 'tanish',
            name: 'Tanish Murgan',
            role: 'Tech Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'tech'
          },
          {
            id: 'pratyush',
            name: 'Pratyush Badrinath',
            role: 'Tech Team Member',
            image: 'pratyush.jpg',
            isLeader: false,
            team: 'tech'
          }
        ]
      },
      {
        id: 'pr',
        title: 'Public Relations Team',
        leader: {
          id: 'samara',
          name: 'Samara Deshnoor',
          role: 'Head of PR',
          image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
          isLeader: true,
          team: 'pr'
        },
        members: [
          {
            id: 'samyukta',
            name: 'Samyukta Shanker',
            role: 'PR Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'pr'
          },
          {
            id: 'natasha',
            name: 'Natasha Cardoz',
            role: 'PR Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'pr'
          }
        ]
      },
      {
        id: 'category',
        title: 'Innovation Team',
        leader: {
          id: 'tanisha',
          name: 'Tanisha Khanna',
          role: 'Mastermind Innovation',
          image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
          isLeader: true,
          team: 'category'
        },
        members: [
          {
            id: 'vanshika',
            name: 'Vanshika Ahuja',
            role: 'Innovation Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'category'
          },
          {
            id: 'eleanor',
            name: 'Eleanor Periera',
            role: 'Innovation Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'category'
          }
        ]
      },
      {
        id: 'logistics',
        title: 'Logistics Team',
        leader: {
          id: 'vishaka',
          name: 'Vishaka Nankani',
          role: 'Head of Logistics',
          image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
          isLeader: true,
          team: 'logistics'
        },
        members: [
          {
            id: 'ashna',
            name: 'Ashna Seth',
            role: 'Logistics Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'logistics'
          },
          {
            id: 'dilara',
            name: 'Dilara Diyagubadu',
            role: 'Logistics Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'logistics'
          }
        ]
      },
      {
        id: 'marketing',
        title: 'Marketing Team',
        leader: {
          id: 'hardik',
          name: 'Hardik Kumar',
          role: 'Head of Marketing',
          image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
          isLeader: true,
          team: 'marketing'
        },
        members: [
          {
            id: 'jiiya',
            name: 'Jiiya Ghai', // Corrected spelling
            role: 'Marketing Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'marketing'
          },
          {
            id: 'Shanaiah',
            name: 'Shanaiah Francisco', // Corrected spelling
            role: 'Marketing Team Member',
            image: 'https://placehold.co/400x400/0A0F1C/3B82F6?text=',
            isLeader: false,
            team: 'marketing'
          }
        ]
      }
    ];
  }

  private bindEvents(): void {
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  private handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (target.closest('.popup-close')) {
      this.closePopup();
    }
  }

  public showTeamHierarchy(teamId: string): void {
    if (teamId === 'president') {
      this.togglePresidentBio();
      return;
    }

    const team = this.teams.find(t => t.id === teamId);
    if (!team) {
      console.error(`Team with id "${teamId}" not found`);
      return;
    }

    this.createTeamPopup(team);
  }

  private togglePresidentBio(): void {
    const leaderBio = document.querySelector('.team-member.president .leader-bio');
    if (leaderBio) {
      leaderBio.classList.toggle('active');
    }
  }

  private createTeamPopup(team: Team): void {
    // Remove existing popup
    this.closePopup();

    const popup = document.createElement('div');
    popup.className = 'team-popup';
    
    popup.innerHTML = `
      <div class="popup-content">
        <div class="popup-close">
          <i class="fas fa-times"></i>
        </div>
        <div class="popup-header">
          <div class="member-image">
            <img src="${team.leader.image}" alt="${team.leader.name}">
          </div>
          <div class="leader-info">
            <h2 style="color: var(--accent);">${team.title}</h2>
            <p class="role">Led by ${team.leader.name}</p>
          </div>
        </div>
        <div class="team-members-grid">
          ${team.members.map(member => `
            <div class="team-member">
              <div class="member-image">
                <img src="${member.image}" alt="${member.name}">
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
    this.popupElement = popup;

    // Trigger animation
    requestAnimationFrame(() => {
      popup.classList.add('active');
    });
  }

  public closePopup(): void {
    if (!this.popupElement) return;

    this.popupElement.classList.remove('active');
    
    setTimeout(() => {
      if (this.popupElement) {
        this.popupElement.remove();
        this.popupElement = null;
      }
    }, 300);
  }

  public getTeam(teamId: string): Team | undefined {
    return this.teams.find(team => team.id === teamId);
  }

  public getAllTeams(): Team[] {
    return [...this.teams];
  }
}
