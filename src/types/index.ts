export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  isLeader: boolean;
  team?: string;
}

export interface Team {
  id: string;
  title: string;
  leader: TeamMember;
  members: TeamMember[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationLink: string;
  image: string;
  details: {
    duration: string;
    format: string;
    prizes: string[];
    requirements: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  rules?: string[];
  teamSize: {
    min: number;
    max: number;
  };
}

export interface RegistrationData {
  studentType: 'ds' | 'external';
  teamName: string;
  schoolName: string;
  category: string;
  members: StudentInfo[];
  supervisor: SupervisorInfo;
}

export interface StudentInfo {
  name: string;
  grade: string;
  email: string;
  phone?: string;
}

export interface SupervisorInfo {
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface PageConfig {
  id: string;
  title: string;
  icon: string;
  tooltip: string;
}

export interface NavigationState {
  currentPage: string;
  previousPage: string | null;
  isTransitioning: boolean;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface DockConfig {
  isVisible: boolean;
  isMobile: boolean;
  isMenuOpen: boolean;
}

export type PageId = 'home' | 'previous-events' | 'categories' | 'register' | 'team';
