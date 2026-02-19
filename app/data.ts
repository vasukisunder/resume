type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type SocialLink = {
  label: string
  link: string
}

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Julius',
    title: 'Product Designer',
    start: 'May 2025',
    end: 'Present',
    link: 'https://julius.ai',
    id: 'work1',
  },
  {
    company: 'Parsons School of Design',
    title: 'Design Lead & Research Assistant',
    start: 'Mar 2025',
    end: 'Present',
    link: 'https://www.newschool.edu/parsons/',
    id: 'work2',
  },
  {
    company: 'CalMatters',
    title: 'Product Designer',
    start: 'May 2022',
    end: 'Aug 2024',
    link: 'https://calmatters.org',
    id: 'work3',
  },
  {
    company: 'Freelance',
    title: 'Visual & UX Designer',
    start: 'Jan 2021',
    end: 'Apr 2022',
    link: 'https://vasuki.design',
    id: 'work4',
  },
  {
    company: 'Accenture',
    title: 'Technology Analyst',
    start: 'Sep 2018',
    end: 'Dec 2019',
    link: 'https://www.accenture.com',
    id: 'work5',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/vasukisunder',
  },
  {
    label: 'Website',
    link: 'https://vasuki.design',
  },
  {
    label: 'Email',
    link: 'mailto:vasukisunder@gmail.com',
  },
]

export const EMAIL = 'vasukisunder@gmail.com'
