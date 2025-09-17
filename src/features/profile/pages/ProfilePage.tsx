import React from 'react';
import { FolderLayout, TabItem } from '../../../shared/components';
import { useTheme } from '../../../styles';
import {
  ProfileHeader,
  PortfolioSection,
  ExperienceSection,
  SkillBadgesGrid,
  EducationSection,
  SkillsSection,
  type PortfolioProject,
  type Experience,
  type SkillBadge,
  type Education,
  type SkillCategory,
} from '../components';

const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'profile', label: 'Profile', path: '/profile' },
  { id: 'explore', label: 'Explore', path: '/explore' },
];

// Demo data from the reference
const portfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "AI-Powered Chat Platform",
    description: "Full-stack web application with React frontend and Django backend, featuring multiple AI personalities and conversation management.",
    image: "https://picsum.photos/seed/ai-chat/400/300",
    technologies: ["React", "Django", "PostgreSQL", "OpenAI API"],
    link: "#"
  },
  {
    id: 2,
    title: "Interactive Skill Tree System",
    description: "SVG-based constellation interface for course progress tracking with real-time updates and dynamic connections.",
    image: "https://picsum.photos/seed/skill-tree/400/300",
    technologies: ["React", "SVG", "CSS Animations", "JWT"],
    link: "#"
  },
  {
    id: 3,
    title: "Virtual Portfolio Platform",
    description: "Modern resume builder with carousel galleries, verified experience badges, and responsive design.",
    image: "https://picsum.photos/seed/portfolio/400/300",
    technologies: ["React", "Tailwind CSS", "REST API", "Authentication"],
    link: "#"
  },
  {
    id: 4,
    title: "Educational Quest Manager",
    description: "Gamified learning platform with milestone tracking, calendar integration, and progress visualization.",
    image: "https://picsum.photos/seed/quest-manager/400/300",
    technologies: ["React Router", "Calendar API", "Dynamic Routing", "JSON Data"],
    link: "#"
  }
];

const experiences: Experience[] = [
  {
    id: 1,
    type: "work",
    title: "Frontend Developer",
    company: "TechStart Inc.",
    location: "San Francisco, CA",
    duration: "Jun 2024 - Present",
    description: "Developing responsive web applications using React and modern CSS frameworks. Led the redesign of the user dashboard, improving user engagement by 35%.",
    verified: true,
    responsibilities: [
      "Built reusable React components for the design system",
      "Implemented responsive layouts with Tailwind CSS",
      "Collaborated with designers on UI/UX improvements",
      "Optimized application performance and accessibility"
    ]
  },
  {
    id: 2,
    type: "volunteer",
    title: "Coding Mentor",
    company: "Code for Good",
    location: "Remote",
    duration: "Jan 2024 - Present",
    description: "Mentoring high school students in web development fundamentals, helping them build their first projects and prepare for coding bootcamps.",
    verified: true,
    responsibilities: [
      "Taught HTML, CSS, and JavaScript fundamentals",
      "Guided students through project-based learning",
      "Organized weekly coding workshops",
      "Provided career guidance and portfolio reviews"
    ]
  },
  {
    id: 3,
    type: "work",
    title: "Junior Web Developer",
    company: "Creative Solutions LLC",
    location: "Austin, TX",
    duration: "Aug 2023 - May 2024",
    description: "Worked on client websites and internal tools, gaining experience with full-stack development and project management.",
    verified: false,
    responsibilities: [
      "Maintained WordPress sites for 20+ clients",
      "Developed custom plugins and themes",
      "Performed SEO optimization and analytics setup",
      "Collaborated with design team on client projects"
    ]
  },
  {
    id: 4,
    type: "volunteer",
    title: "Web Developer",
    company: "Local Animal Shelter",
    location: "Austin, TX",
    duration: "Mar 2023 - Jul 2023",
    description: "Redesigned the shelter's website to improve pet adoption rates and volunteer recruitment.",
    verified: true,
    responsibilities: [
      "Built responsive adoption gallery with search filters",
      "Integrated with pet management database",
      "Improved site speed by 60% through optimization",
      "Trained staff on content management system"
    ]
  }
];

const skillBadges: SkillBadge[] = [
  { name: "React Expert", color: "#61DAFB", earned: "2024" },
  { name: "JavaScript Master", color: "#F7DF1E", earned: "2024" },
  { name: "CSS Wizard", color: "#1572B6", earned: "2023" },
  { name: "Git Guru", color: "#F05032", earned: "2023" },
  { name: "API Integration", color: "#FF6B6B", earned: "2024" },
  { name: "UI/UX Design", color: "#4ECDC4", earned: "2024" },
  { name: "Database Design", color: "#336791", earned: "2023" },
  { name: "Agile Methodology", color: "#96CEB4", earned: "2024" }
];

const education: Education[] = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "University of Texas at Austin",
    duration: "2020 - 2024",
    gpa: "3.8/4.0",
    relevant: ["Data Structures", "Web Development", "Software Engineering", "Database Systems"]
  }
];

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    color: "#61DAFB",
    skills: ["React", "JavaScript (ES6+)", "TypeScript", "CSS3/Sass", "Tailwind CSS", "HTML5"]
  },
  {
    title: "Backend",
    color: "#68A063",
    skills: ["Python", "Django", "Node.js", "PostgreSQL", "REST APIs", "JWT Auth"]
  },
  {
    title: "Tools & Others",
    color: "#6B7280",
    skills: ["Git/GitHub", "Docker", "AWS", "Figma", "Agile/Scrum", "CI/CD"]
  }
];

export const ProfilePage: React.FC = () => {
  const { tokens } = useTheme();

  const getStyles = () => ({
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      minHeight: 0,
    },
    scrollableContent: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: tokens.spacing[6],
      display: 'flex',
      flexDirection: 'column' as const,
      gap: tokens.spacing[8],
      minHeight: 0,
    },
  });

  const styles = getStyles();

  const handleMenuClick = () => {
    console.log('Profile menu clicked');
  };

  return (
    <FolderLayout title="Professional Profile" tabs={tabs} onMenuClick={handleMenuClick}>
      <div style={styles.container} data-testid="profile-page">
        <div style={styles.scrollableContent}>
        <ProfileHeader
          fullName="Alex Johnson"
          title="Full-Stack Developer & Creative Problem Solver"
          bio="Passionate software developer with 3+ years of experience building modern web applications. I love creating user-centric solutions that blend technical excellence with intuitive design. Always eager to learn new technologies and contribute to meaningful projects."
          email="alex.johnson@email.com"
          location="Austin, TX"
          linkedinUrl="https://linkedin.com/in/alexjohnson"
          profilePhotoUrl="https://picsum.photos/seed/profile/256/256"
        />

        <PortfolioSection projects={portfolioProjects} />

        <ExperienceSection experiences={experiences} />

        <SkillBadgesGrid badges={skillBadges} />

        <EducationSection education={education} />

        <SkillsSection skillCategories={skillCategories} />
        </div>
      </div>
    </FolderLayout>
  );
};