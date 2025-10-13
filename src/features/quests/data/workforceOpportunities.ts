export interface WorkforceOpportunity {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  image: string;
  link: string;
}

export const workforceOpportunities: WorkforceOpportunity[] = [
  {
    id: 'wfb-1',
    title: 'Willamette Workforce Partnership',
    subtitle: 'Job Seeker Resources',
    body: 'Connect with employment services, training programs, and career development opportunities in the Willamette Valley region.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrqIuYtv264D8xVTUvYnPHF9eszJYuo9I0og&s',
    link: 'https://willwp.org/jobseekers/',
  },
  {
    id: 'wfb-2',
    title: 'WorkSource Oregon',
    subtitle: 'Employment Services',
    body: 'Access job listings, career counseling, training resources, and employment support services across Oregon.',
    image: 'https://mcminnville.org/wp-content/uploads/2020/03/Worksource-Oregon-Yamhill-Center-Logo.jpg',
    link: 'https://worksourceoregon.org/jobseekers',
  },
  {
    id: 'wfb-3',
    title: 'City of Salem',
    subtitle: 'Government Jobs',
    body: 'Explore employment opportunities with the City of Salem, including public service positions and career growth.',
    image: 'https://www.fws.gov/sites/default/files/images/2025-02/city-of-salem-2025.png',
    link: 'https://www.cityofsalem.net/government/jobs',
  },
];
