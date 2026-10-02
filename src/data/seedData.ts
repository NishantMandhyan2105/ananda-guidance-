import { 
  User, MentorProfile, JuniorProfile, MentorMatch, 
  Interaction, ActionItem, MonthlyPulse, Escalation, 
  SuccessStory, NotificationItem, ProgramSettings, AuditLog 
} from '../types';

export const INITIAL_PROGRAM_SETTINGS: ProgramSettings = {
  id: 'settings-1',
  program_name: 'ĀNANDA Senior–Junior Guidance Connect',
  tagline: 'BELONG • LEARN • CARE • GROW',
  pilot_start_date: '2026-08-01',
  pilot_end_date: '2026-10-31',
  interaction_threshold_days: 21,
  max_juniors_per_mentor: 3,
  matching_weights: {
    program: 0.25,
    interest: 0.25,
    guidance: 0.20,
    skill: 0.15,
    availability: 0.10,
    experience: 0.05
  },
  active: true
};

// 4 Predefined Demo Accounts
export const DEMO_ADMIN: User = {
  id: 'usr-admin-1',
  name: 'Prof. Rajesh K. Sundaram',
  email: 'admin@university.edu',
  role: 'admin',
  student_id: 'FAC-2012-004',
  department: 'Dean of Student Welfare',
  program: 'Institutional Administration',
  semester: 0,
  phone: '+91 98765 43210',
  status: 'active',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  created_at: '2026-07-15T09:00:00Z',
  updated_at: '2026-07-15T09:00:00Z'
};

export const DEMO_COORDINATOR: User = {
  id: 'usr-coord-1',
  name: 'Dr. Sunita Raman',
  email: 'coordinator@university.edu',
  role: 'coordinator',
  student_id: 'FAC-2018-089',
  department: 'Computer Science & Engineering',
  program: 'B.Tech CSE',
  semester: 0,
  phone: '+91 98123 45678',
  status: 'active',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  created_at: '2026-07-18T10:00:00Z',
  updated_at: '2026-07-18T10:00:00Z'
};

export const DEMO_MENTOR: User = {
  id: 'usr-mentor-1',
  name: 'Aarav Sharma',
  email: 'mentor@university.edu',
  role: 'mentor',
  student_id: '2023-CS-042',
  department: 'Computer Science & Engineering',
  program: 'B.Tech CSE',
  semester: 7,
  phone: '+91 98234 56789',
  status: 'active',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  created_at: '2026-07-20T11:00:00Z',
  updated_at: '2026-07-20T11:00:00Z'
};

export const DEMO_JUNIOR: User = {
  id: 'usr-junior-1',
  name: 'Aditi Deshpande',
  email: 'junior@university.edu',
  role: 'junior',
  student_id: '2026-CS-108',
  department: 'Computer Science & Engineering',
  program: 'B.Tech CSE',
  semester: 1,
  phone: '+91 98345 67890',
  status: 'active',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  created_at: '2026-08-02T08:30:00Z',
  updated_at: '2026-08-02T08:30:00Z'
};

// 20 Mentors
export const MENTORS_USERS: User[] = [
  DEMO_MENTOR,
  {
    id: 'usr-mentor-2',
    name: 'Priya Patel',
    email: 'priya.patel@university.edu',
    role: 'mentor',
    student_id: '2023-CS-019',
    department: 'Computer Science & Engineering',
    program: 'B.Tech CSE',
    semester: 7,
    phone: '+91 98456 12345',
    status: 'active',
    created_at: '2026-07-20T11:15:00Z',
    updated_at: '2026-07-20T11:15:00Z'
  },
  {
    id: 'usr-mentor-3',
    name: 'Rohan Iyer',
    email: 'rohan.iyer@university.edu',
    role: 'mentor',
    student_id: '2023-IT-031',
    department: 'Information Technology',
    program: 'B.Tech IT',
    semester: 7,
    phone: '+91 98567 23456',
    status: 'active',
    created_at: '2026-07-20T11:30:00Z',
    updated_at: '2026-07-20T11:30:00Z'
  },
  {
    id: 'usr-mentor-4',
    name: 'Ananya Verma',
    email: 'ananya.verma@university.edu',
    role: 'mentor',
    student_id: '2024-ECE-015',
    department: 'Electronics & Communication',
    program: 'B.Tech ECE',
    semester: 5,
    phone: '+91 98678 34567',
    status: 'active',
    created_at: '2026-07-21T09:00:00Z',
    updated_at: '2026-07-21T09:00:00Z'
  },
  {
    id: 'usr-mentor-5',
    name: 'Vikram Rao',
    email: 'vikram.rao@university.edu',
    role: 'mentor',
    student_id: '2023-MECH-008',
    department: 'Mechanical Engineering',
    program: 'B.Tech Mechanical',
    semester: 7,
    phone: '+91 98789 45678',
    status: 'active',
    created_at: '2026-07-21T09:30:00Z',
    updated_at: '2026-07-21T09:30:00Z'
  },
  {
    id: 'usr-mentor-6',
    name: 'Neha Deshmukh',
    email: 'neha.deshmukh@university.edu',
    role: 'mentor',
    student_id: '2024-BIO-022',
    department: 'Biotechnology',
    program: 'B.Tech Biotechnology',
    semester: 5,
    phone: '+91 98890 56789',
    status: 'active',
    created_at: '2026-07-21T10:00:00Z',
    updated_at: '2026-07-21T10:00:00Z'
  },
  {
    id: 'usr-mentor-7',
    name: 'Aditya Nair',
    email: 'aditya.nair@university.edu',
    role: 'mentor',
    student_id: '2023-CS-058',
    department: 'Computer Science & Engineering',
    program: 'B.Tech CSE',
    semester: 7,
    phone: '+91 98901 67890',
    status: 'active',
    created_at: '2026-07-22T14:00:00Z',
    updated_at: '2026-07-22T14:00:00Z'
  },
  {
    id: 'usr-mentor-8',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@university.edu',
    role: 'mentor',
    student_id: '2023-IT-014',
    department: 'Information Technology',
    program: 'B.Tech IT',
    semester: 7,
    phone: '+91 98012 78901',
    status: 'active',
    created_at: '2026-07-22T14:30:00Z',
    updated_at: '2026-07-22T14:30:00Z'
  },
  {
    id: 'usr-mentor-9',
    name: 'Siddharth Sen',
    email: 'siddharth.sen@university.edu',
    role: 'mentor',
    student_id: '2024-ECE-041',
    department: 'Electronics & Communication',
    program: 'B.Tech ECE',
    semester: 5,
    phone: '+91 98123 89012',
    status: 'active',
    created_at: '2026-07-23T10:00:00Z',
    updated_at: '2026-07-23T10:00:00Z'
  },
  {
    id: 'usr-mentor-10',
    name: 'Pooja Reddy',
    email: 'pooja.reddy@university.edu',
    role: 'mentor',
    student_id: '2023-MGMT-003',
    department: 'Management Studies',
    program: 'BBA / MBA Tech',
    semester: 7,
    phone: '+91 98234 90123',
    status: 'active',
    created_at: '2026-07-23T11:00:00Z',
    updated_at: '2026-07-23T11:00:00Z'
  },
  {
    id: 'usr-mentor-11',
    name: 'Tanmay Joshi',
    email: 'tanmay.joshi@university.edu',
    role: 'mentor',
    student_id: '2023-CS-077',
    department: 'Computer Science & Engineering',
    program: 'B.Tech CSE',
    semester: 7,
    phone: '+91 98345 01234',
    status: 'active',
    created_at: '2026-07-24T12:00:00Z',
    updated_at: '2026-07-24T12:00:00Z'
  },
  {
    id: 'usr-mentor-12',
    name: 'Ishita Banerjee',
    email: 'ishita.banerjee@university.edu',
    role: 'mentor',
    student_id: '2024-DES-005',
    department: 'Design & Media',
    program: 'B.Des Interaction Design',
    semester: 5,
    phone: '+91 98456 12340',
    status: 'active',
    created_at: '2026-07-24T13:00:00Z',
    updated_at: '2026-07-24T13:00:00Z'
  },
  {
    id: 'usr-mentor-13',
    name: 'Arjun Menon',
    email: 'arjun.menon@university.edu',
    role: 'mentor',
    student_id: '2023-MECH-029',
    department: 'Mechanical Engineering',
    program: 'B.Tech Mechanical',
    semester: 7,
    phone: '+91 98567 23451',
    status: 'active',
    created_at: '2026-07-25T15:00:00Z',
    updated_at: '2026-07-25T15:00:00Z'
  },
  {
    id: 'usr-mentor-14',
    name: 'Meera Nambiar',
    email: 'meera.nambiar@university.edu',
    role: 'mentor',
    student_id: '2024-CS-062',
    department: 'Computer Science & Engineering',
    program: 'B.Tech CSE',
    semester: 5,
    phone: '+91 98678 34562',
    status: 'active',
    created_at: '2026-07-25T16:00:00Z',
    updated_at: '2026-07-25T16:00:00Z'
  },
  {
    id: 'usr-mentor-15',
    name: 'Kabir Malhotra',
    email: 'kabir.malhotra@university.edu',
    role: 'mentor',
    student_id: '2023-IT-049',
    department: 'Information Technology',
    program: 'B.Tech IT',
    semester: 7,
    phone: '+91 98789 45673',
    status: 'active',
    created_at: '2026-07-26T10:00:00Z',
    updated_at: '2026-07-26T10:00:00Z'
  },
  {
    id: 'usr-mentor-16',
    name: 'Divya Chauhan',
    email: 'divya.chauhan@university.edu',
    role: 'mentor',
    student_id: '2024-ECE-018',
    department: 'Electronics & Communication',
    program: 'B.Tech ECE',
    semester: 5,
    phone: '+91 98890 56784',
    status: 'active',
    created_at: '2026-07-26T11:00:00Z',
    updated_at: '2026-07-26T11:00:00Z'
  },
  {
    id: 'usr-mentor-17',
    name: 'Rahul Varma',
    email: 'rahul.varma@university.edu',
    role: 'mentor',
    student_id: '2023-CS-091',
    department: 'Computer Science & Engineering',
    program: 'B.Tech CSE',
    semester: 7,
    phone: '+91 98901 67895',
    status: 'active',
    created_at: '2026-07-27T10:30:00Z',
    updated_at: '2026-07-27T10:30:00Z'
  },
  {
    id: 'usr-mentor-18',
    name: 'Ritu Singhania',
    email: 'ritu.singhania@university.edu',
    role: 'mentor',
    student_id: '2024-MGMT-011',
    department: 'Management Studies',
    program: 'BBA / MBA Tech',
    semester: 5,
    phone: '+91 98012 78906',
    status: 'active',
    created_at: '2026-07-27T11:30:00Z',
    updated_at: '2026-07-27T11:30:00Z'
  },
  {
    id: 'usr-mentor-19',
    name: 'Harsh Vardhan',
    email: 'harsh.vardhan@university.edu',
    role: 'mentor',
    student_id: '2023-MECH-044',
    department: 'Mechanical Engineering',
    program: 'B.Tech Mechanical',
    semester: 7,
    phone: '+91 98123 89017',
    status: 'active',
    created_at: '2026-07-28T09:00:00Z',
    updated_at: '2026-07-28T09:00:00Z'
  },
  {
    id: 'usr-mentor-20',
    name: 'Shreya Hegde',
    email: 'shreya.hegde@university.edu',
    role: 'mentor',
    student_id: '2024-BIO-007',
    department: 'Biotechnology',
    program: 'B.Tech Biotechnology',
    semester: 5,
    phone: '+91 98234 90128',
    status: 'active',
    created_at: '2026-07-28T10:00:00Z',
    updated_at: '2026-07-28T10:00:00Z'
  }
];

// Mentor Profiles corresponding to 20 mentors
export const MENTOR_PROFILES: MentorProfile[] = [
  {
    id: 'prof-m-1',
    user_id: 'usr-mentor-1',
    skills: ['C++', 'Python', 'Data Structures', 'Git', 'System Design'],
    interests: ['Systems Programming', 'Open Source', 'Hackathons', 'Cricket'],
    technologies: ['Linux', 'Docker', 'React', 'FastAPI'],
    projects: ['Campus Lost & Found Portal', 'Automated Lab Attendance Checker'],
    achievements: ['Smart India Hackathon Finalist', 'Dean’s Honour List Sem 4 & 6'],
    competitions: ['SIH 2025', 'ACM ICPC Regionals Participant'],
    internships: ['Systems Intern @ Zerodha (Summer 2025)'],
    guidance_areas: ['Programming', 'DSA', 'Academics', 'Hackathons'],
    availability: '3-4 hours/month (Weekends)',
    bio: 'Senior CSE student passionate about foundational programming concepts. I focus on helping juniors build problem-solving patience without getting overwhelmed by trendy frameworks too early.',
    created_at: '2026-07-20T11:00:00Z'
  },
  {
    id: 'prof-m-2',
    user_id: 'usr-mentor-2',
    skills: ['Java', 'Object Oriented Design', 'Web Dev', 'SQL'],
    interests: ['Full Stack Web', 'Tech Communities', 'Badminton'],
    technologies: ['Spring Boot', 'PostgreSQL', 'TypeScript'],
    projects: ['Department Course Evaluation Engine'],
    achievements: ['Department Merit Scholar'],
    competitions: ['Kaggle Mini-Competitions'],
    internships: ['Software Engineer Intern @ Infosys'],
    guidance_areas: ['Academics', 'Web Development', 'Clubs'],
    availability: '2 hours/month (Evenings)',
    bio: 'Helping juniors navigate university coursework, exam prep strategies, and taking initial steps in web development without burnout.',
    created_at: '2026-07-20T11:15:00Z'
  },
  {
    id: 'prof-m-3',
    user_id: 'usr-mentor-3',
    skills: ['Python', 'Data Analysis', 'SQL', 'Bash'],
    interests: ['Data Science', 'Tech Writing', 'Chess'],
    technologies: ['Pandas', 'PostgreSQL', 'Tableau'],
    projects: ['Student Placement Trend Visualizer'],
    achievements: ['Best Paper Award at Student Tech Fest'],
    competitions: ['Inter-college Data Hackathon Winner'],
    internships: ['Data Analytics Intern @ MuSigma'],
    guidance_areas: ['Data', 'Career Exploration', 'Academics'],
    availability: '3 hours/month',
    bio: 'Senior IT student. I believe in practicing one problem deeply rather than skimming ten. Happy to guide on data foundations and study habits.',
    created_at: '2026-07-20T11:30:00Z'
  },
  {
    id: 'prof-m-4',
    user_id: 'usr-mentor-4',
    skills: ['Embedded C', 'MATLAB', 'Circuit Design', 'Verilog'],
    interests: ['IoT', 'Robotics', 'Classical Music'],
    technologies: ['Arduino', 'Raspberry Pi', 'Eagle PCB'],
    projects: ['Smart Agriculture Sensor Array'],
    achievements: ['RoboWars 2nd Runner Up'],
    competitions: ['IIT Bombay Techfest Hardware Challenge'],
    internships: ['Hardware Engineering Intern @ Bosch'],
    guidance_areas: ['Academics', 'Projects', 'Clubs'],
    availability: '2 hours/month',
    bio: 'ECE senior. First semester can feel daunting with Physics and Circuit Theory. I help with lab preparation and time management.',
    created_at: '2026-07-21T09:00:00Z'
  },
  {
    id: 'prof-m-5',
    user_id: 'usr-mentor-5',
    skills: ['SolidWorks', 'ANSYS', 'AutoCAD', 'Thermodynamics'],
    interests: ['Automotive', 'Additive Manufacturing', 'Cycling'],
    technologies: ['CAD/CAM', '3D Printing'],
    projects: ['Baja SAE Off-road Chassis Design'],
    achievements: ['Team Captain Baja SAE 2025'],
    competitions: ['Baja SAE India'],
    internships: ['Trainee @ Tata Motors Pimpri'],
    guidance_areas: ['Academics', 'Clubs', 'Career Exploration'],
    availability: '2-3 hours/month',
    bio: 'Passionate about engineering design and college team clubs. Guide juniors in balancing workshop hours with academic study.',
    created_at: '2026-07-21T09:30:00Z'
  },
  {
    id: 'prof-m-6',
    user_id: 'usr-mentor-6',
    skills: ['Bioinformatics', 'Python', 'Molecular Biology', 'Statistics'],
    interests: ['Genomics', 'Computational Biology', 'Debating'],
    technologies: ['Biopython', 'R', 'PyMOL'],
    projects: ['Enzyme Binding Locus Identification'],
    achievements: ['KVPY Fellow'],
    competitions: ['Bio-Design Challenge'],
    internships: ['Research Intern @ NCBS Bangalore'],
    guidance_areas: ['Academics', 'Projects', 'Communication'],
    availability: '2 hours/month',
    bio: 'Connecting computational tools with core biology. Mentoring first-years on literature reading and lab fundamentals.',
    created_at: '2026-07-21T10:00:00Z'
  },
  {
    id: 'prof-m-7',
    user_id: 'usr-mentor-7',
    skills: ['Python', 'Machine Learning', 'Linear Algebra', 'DSA'],
    interests: ['Applied AI', 'Mathematics', 'Photography'],
    technologies: ['PyTorch', 'Scikit-Learn', 'NumPy'],
    projects: ['Plant Disease Classifier for Local Farmers'],
    achievements: ['Top 5% in NPTEL Deep Learning'],
    competitions: ['Kaggle Community Hackathon 1st Place'],
    internships: ['Research Assistant @ AI Lab'],
    guidance_areas: ['AI', 'Programming', 'Academics'],
    availability: '3 hours/month',
    bio: 'I advocate building solid math and coding fundamentals before jumping into LLMs. Let’s tackle first-semester calculus and C programming together.',
    created_at: '2026-07-22T14:00:00Z'
  },
  {
    id: 'prof-m-8',
    user_id: 'usr-mentor-8',
    skills: ['Network Security', 'Linux', 'Python', 'Wireshark'],
    interests: ['Cybersecurity', 'CTF Challenges', 'Gaming'],
    technologies: ['Metasploit', 'Burp Suite', 'Docker'],
    projects: ['Campus Wi-Fi Security Audit Report'],
    achievements: ['CyberDefenders CTF Finalist'],
    competitions: ['InCTF 2025'],
    internships: ['Security Analyst Intern @ QuickHeal'],
    guidance_areas: ['Cybersecurity', 'Programming', 'Clubs'],
    availability: '2 hours/month',
    bio: 'Cybersecurity enthusiast. Ready to help first-years discover safe CTF labs and set up their first Linux environment.',
    created_at: '2026-07-22T14:30:00Z'
  },
  {
    id: 'prof-m-9',
    user_id: 'usr-mentor-9',
    skills: ['Signals & Systems', 'C', 'Digital Electronics', 'VLSI basics'],
    interests: ['Semiconductors', 'Audio Tech', 'Guitar'],
    technologies: ['ModelSim', 'Cadence Virtuoso', 'LTSpice'],
    projects: ['Low Power 4-bit ALU Design'],
    achievements: ['Branch Topper 4th Semester'],
    competitions: ['IEEE Student Technical Paper Contest'],
    internships: ['Summer Trainee @ Texas Instruments'],
    guidance_areas: ['Academics', 'Projects', 'Career Exploration'],
    availability: '2 hours/month',
    bio: 'ECE can have heavy math; I share notes and study schedules that saved my grades in year one.',
    created_at: '2026-07-23T10:00:00Z'
  },
  {
    id: 'prof-m-10',
    user_id: 'usr-mentor-10',
    skills: ['Business Analytics', 'Financial Modeling', 'Public Speaking', 'Excel'],
    interests: ['Product Management', 'Consulting', 'Table Tennis'],
    technologies: ['PowerBI', 'Advanced Excel', 'Figma'],
    projects: ['Student Campus Canteen Queue Optimization'],
    achievements: ['National B-School Case Competition Top 10'],
    competitions: ['Hult Prize Campus Round Winner'],
    internships: ['Associate Product Intern @ Flipkart'],
    guidance_areas: ['Communication', 'Career Exploration', 'Clubs'],
    availability: '3 hours/month',
    bio: 'Guiding juniors in soft skills, overcoming stage fear, and discovering product/management pathways alongside technical studies.',
    created_at: '2026-07-23T11:00:00Z'
  },
  {
    id: 'prof-m-11',
    user_id: 'usr-mentor-11',
    skills: ['C++', 'Competitive Programming', 'Graph Algorithms', 'Dynamic Programming'],
    interests: ['Codeforces', 'Algorithmic Problem Solving', 'Marathon Running'],
    technologies: ['GCC', 'Git', 'Vim'],
    projects: ['Competitive Programming Practice Companion CLI'],
    achievements: ['Codeforces Candidate Master', 'ICPC Amritapuri Regionalist'],
    competitions: ['ICPC Regionals 2024 & 2025', 'Google Kickstart Top 500'],
    internships: ['Software Engineer Intern @ Google India (Bangalore)'],
    guidance_areas: ['DSA', 'Programming', 'Hackathons'],
    availability: '2-3 hours/month',
    bio: 'Do not fear coding contests! I help first-years write their first 50 problems with patience and zero stress.',
    created_at: '2026-07-24T12:00:00Z'
  },
  {
    id: 'prof-m-12',
    user_id: 'usr-mentor-12',
    skills: ['User Research', 'UI/UX', 'Figma', 'Prototyping', 'Design Systems'],
    interests: ['Typography', 'Accessibility', 'Photography'],
    technologies: ['Figma', 'Adobe Illustrator', 'HTML/CSS'],
    projects: ['Accessible Campus Navigation App for Visually Impaired'],
    achievements: ['Designthon India Runner Up'],
    competitions: ['Adobe Creative Jam Finalist'],
    internships: ['UX Design Intern @ Swiggy Design Team'],
    guidance_areas: ['Projects', 'Web Development', 'Communication'],
    availability: '2 hours/month',
    bio: 'Design is not just pretty colors, it is problem solving. Here to help juniors with design thinking and portfolio foundations.',
    created_at: '2026-07-24T13:00:00Z'
  },
  {
    id: 'prof-m-13',
    user_id: 'usr-mentor-13',
    skills: ['Robotics', 'Mechatronics', 'Control Systems', 'Python'],
    interests: ['Drone Technology', 'Aeromodelling', 'Hiking'],
    technologies: ['ROS2', 'Gazebo', 'SolidWorks'],
    projects: ['Autonomous Warehouse Drone Prototype'],
    achievements: ['University Best Engineering Capstone Award'],
    competitions: ['e-Yantra Robotics Competition Winner'],
    internships: ['Robotics Trainee @ DRDO Labs'],
    guidance_areas: ['Projects', 'Clubs', 'Academics'],
    availability: '3 hours/month',
    bio: 'Hands-on hardware tinkerer. Can guide on how to join technical societies and make early prototypes without expensive kits.',
    created_at: '2026-07-25T15:00:00Z'
  },
  {
    id: 'prof-m-14',
    user_id: 'usr-mentor-14',
    skills: ['JavaScript', 'React', 'TailwindCSS', 'Node.js'],
    interests: ['Open Source', 'Frontend Architecture', 'Blogging'],
    technologies: ['Next.js', 'Vite', 'Git', 'MongoDB'],
    projects: ['Student Event Ticketing Platform'],
    achievements: ['Open Source Contributor @ freeCodeCamp'],
    competitions: ['HackOut Hackathon 2nd Place'],
    internships: ['Frontend Intern @ Postman'],
    guidance_areas: ['Web Development', 'Programming', 'Projects'],
    availability: '2 hours/month',
    bio: 'I struggled a lot in my 1st semester with programming syntax. Now I share step-by-step guides so juniors don’t repeat my mistakes.',
    created_at: '2026-07-25T16:00:00Z'
  },
  {
    id: 'prof-m-15',
    user_id: 'usr-mentor-15',
    skills: ['Cloud Computing', 'AWS', 'DevOps', 'Go'],
    interests: ['Distributed Systems', 'Cloud Architecture', 'Podcasts'],
    technologies: ['AWS', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    projects: ['Multi-region Cloud Cost Monitor'],
    achievements: ['AWS Certified Solutions Architect Associate'],
    competitions: ['Cloud Community Hackathon'],
    internships: ['Cloud Engineering Intern @ Wipro'],
    guidance_areas: ['Career Exploration', 'Programming', 'Projects'],
    availability: '2 hours/month',
    bio: 'Demystifying the cloud. Helping students learn Linux and networking fundamentals before jumping into certificates.',
    created_at: '2026-07-26T10:00:00Z'
  },
  {
    id: 'prof-m-16',
    user_id: 'usr-mentor-16',
    skills: ['Analog Electronics', 'Microcontrollers', 'C', 'IoT'],
    interests: ['Assistive Tech', 'Smart Grids', 'Yoga'],
    technologies: ['ESP32', 'STM32', 'KiCad'],
    projects: ['Vibration-based Alert Band for Hearing Impaired'],
    achievements: ['IEEE Women in Engineering Leadership Award'],
    competitions: ['Texas Instruments Innovation Challenge'],
    internships: ['Hardware Intern @ L&T Technology Services'],
    guidance_areas: ['Academics', 'Projects', 'Clubs'],
    availability: '3 hours/month',
    bio: 'Encouraging young engineers to stay curious, ask questions in lab sessions, and conquer exam anxiety.',
    created_at: '2026-07-26T11:00:00Z'
  },
  {
    id: 'prof-m-17',
    user_id: 'usr-mentor-17',
    skills: ['C', 'Operating Systems', 'Computer Networks', 'Debugging'],
    interests: ['Kernel Development', 'Retro Computing', 'Football'],
    technologies: ['GDB', 'QEMU', 'Linux Kernel'],
    projects: ['Mini Toy OS Kernel in C and x86 Assembly'],
    achievements: ['Department Academic Excellence Prize'],
    competitions: ['ACM Student Chapter Coding Sprint 1st'],
    internships: ['Systems Software Intern @ Qualcomm India'],
    guidance_areas: ['Academics', 'Programming', 'DSA'],
    availability: '2 hours/month',
    bio: 'Computer systems don’t have to be mysterious. Let’s make C pointers and memory management feel natural and fun.',
    created_at: '2026-07-27T10:30:00Z'
  },
  {
    id: 'prof-m-18',
    user_id: 'usr-mentor-18',
    skills: ['Presentation Design', 'Business Communication', 'Marketing', 'Excel'],
    interests: ['Debate', 'Student Governance', 'Reading'],
    technologies: ['Pitch', 'Excel', 'Canva'],
    projects: ['University Orientation Welcome Guide 2025'],
    achievements: ['University Youth Parliament Best Speaker'],
    competitions: ['National Parliamentary Debate Tournament Finalist'],
    internships: ['Marketing Associate Intern @ Zomato'],
    guidance_areas: ['Communication', 'Clubs', 'Career Exploration'],
    availability: '3 hours/month',
    bio: 'Empowering first-year students to speak up with confidence in classroom seminars and student society interviews.',
    created_at: '2026-07-27T11:30:00Z'
  },
  {
    id: 'prof-m-19',
    user_id: 'usr-mentor-19',
    skills: ['Manufacturing Processes', 'Machine Design', 'MATLAB', 'Python'],
    interests: ['Renewable Energy', 'Solar Vehicles', 'Badminton'],
    technologies: ['Fusion 360', 'Simulink'],
    projects: ['Solar Powered Regenerative Braking Rig'],
    achievements: ['Eco-Green Innovator Award 2025'],
    competitions: ['Solar Vehicle Challenge Top 5'],
    internships: ['R&D Intern @ Mahindra Electric'],
    guidance_areas: ['Academics', 'Career Exploration', 'Projects'],
    availability: '2 hours/month',
    bio: 'Helping first-year students connect theoretical physics formulas with real mechanical mechanisms.',
    created_at: '2026-07-28T09:00:00Z'
  },
  {
    id: 'prof-m-20',
    user_id: 'usr-mentor-20',
    skills: ['Cell Culture', 'Genetic Engineering Basics', 'Python for Biology', 'R'],
    interests: ['Synthetic Biology', 'Science Communication', 'Painting'],
    technologies: ['NCBI BLAST', 'UniProt', 'RStudio'],
    projects: ['Plastic Degrading Bacterial Strain Literature Review'],
    achievements: ['DST INSPIRE Scholar'],
    competitions: ['iGEM Student Jamboree Team Member'],
    internships: ['Biochem Intern @ Biocon'],
    guidance_areas: ['Academics', 'Projects', 'Communication'],
    availability: '2 hours/month',
    bio: 'Passionate about guiding freshers in lab safety, science report drafting, and managing difficult coursework.',
    created_at: '2026-07-28T10:00:00Z'
  }
];

// Generate 50 realistic Indian Junior students (Semester 1)
const FIRST_NAMES = [
  'Aditi', 'Devansh', 'Kavya', 'Aryan', 'Tanvi', 'Manish', 'Simran', 'Ishaan', 'Rhea', 'Kunal',
  'Shubham', 'Anika', 'Dhruv', 'Suhani', 'Kartik', 'Bhavna', 'Pranav', 'Vidhi', 'Samarth', 'Diya',
  'Yash', 'Shruti', 'Harshita', 'Akash', 'Mehul', 'Tara', 'Varun', 'Nandini', 'Gaurav', 'Ira',
  'Chirag', 'Palak', 'Abhinav', 'Payal', 'Tushar', 'Janhavi', 'Sanket', 'Garima', 'Naveen', 'Mallika',
  'Omkar', 'Ayesha', 'Siddhesh', 'Richa', 'Nikhil', 'Tejaswini', 'Jayesh', 'Prachi', 'Alok', 'Charulata'
];

const LAST_NAMES = [
  'Deshpande', 'Gupta', 'Sinha', 'Chopra', 'Nair', 'Bose', 'Kulkarni', 'Jadhav', 'Mehta', 'Bhat',
  'Mishra', 'Kapoor', 'Tiwari', 'Bhattacharya', 'Ranganathan', 'Pillai', 'Saxena', 'Pandey', 'Dutta', 'Goyal',
  'Kashyap', 'Chakraborty', 'Shetty', 'Dubey', 'Gokhale', 'Mukherjee', 'Thakur', 'Tripathi', 'Patwardhan', 'Barua',
  'Rathore', 'Menon', 'Jain', 'Garg', 'Bansal', 'Agrawal', 'Sengupta', 'Venkatesh', 'Kaur', 'Poddar',
  'Bhardwaj', 'Goswami', 'Majumdar', 'Naik', 'Mohanty', 'Dasgupta', 'Soni', 'Singhal', 'Khatri', 'Choudhury'
];

const DEPARTMENTS = [
  { dept: 'Computer Science & Engineering', prog: 'B.Tech CSE' },
  { dept: 'Computer Science & Engineering', prog: 'B.Tech CSE (AI & ML)' },
  { dept: 'Information Technology', prog: 'B.Tech IT' },
  { dept: 'Electronics & Communication', prog: 'B.Tech ECE' },
  { dept: 'Mechanical Engineering', prog: 'B.Tech Mechanical' },
  { dept: 'Biotechnology', prog: 'B.Tech Biotechnology' },
  { dept: 'Management Studies', prog: 'BBA / MBA Tech' },
  { dept: 'Design & Media', prog: 'B.Des Interaction Design' }
];

const GUIDANCE_TOPICS = [
  'Programming', 'DSA', 'Academics', 'Projects', 'AI', 
  'Web Development', 'Cybersecurity', 'Data', 'Hackathons', 
  'Communication', 'Clubs', 'Internships', 'Career Exploration'
];

export const JUNIORS_USERS: User[] = [
  DEMO_JUNIOR,
  ...Array.from({ length: 49 }, (_, idx) => {
    const fName = FIRST_NAMES[(idx + 1) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(idx + 3) % LAST_NAMES.length];
    const deptInfo = DEPARTMENTS[idx % DEPARTMENTS.length];
    const num = String(idx + 2).padStart(2, '0');
    return {
      id: `usr-junior-${idx + 2}`,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@university.edu`,
      role: 'junior' as const,
      student_id: `2026-${deptInfo.dept.substring(0, 2).toUpperCase()}-1${num}`,
      department: deptInfo.dept,
      program: deptInfo.prog,
      semester: 1,
      phone: `+91 97${String(idx + 100).padStart(3, '0')} ${String(idx + 2000).padStart(5, '0')}`,
      status: 'active' as const,
      created_at: `2026-08-0${(idx % 8) + 1}T10:00:00Z`,
      updated_at: `2026-08-0${(idx % 8) + 1}T10:00:00Z`
    };
  })
];

export const JUNIOR_PROFILES: JuniorProfile[] = JUNIORS_USERS.map((user, idx) => {
  const gArea1 = GUIDANCE_TOPICS[idx % GUIDANCE_TOPICS.length];
  const gArea2 = GUIDANCE_TOPICS[(idx + 3) % GUIDANCE_TOPICS.length];
  const gArea3 = GUIDANCE_TOPICS[(idx + 7) % GUIDANCE_TOPICS.length];

  const goals = [
    'Understand fundamental C programming syntax and pass Mid-Terms with confidence.',
    'Build daily study routine to balance engineering mechanics and calculus.',
    'Clear basic data structures concepts without memorizing algorithms.',
    'Overcome hesitation in classroom seminars and join one technical society.',
    'Learn basic Git commands and contribute to first mini-project.',
    'Explore university lab equipment safely and understand experimental procedures.',
    'Gain clarity on difference between web development and machine learning pathways.',
    'Improve semester GPA and organize weekly lecture revision notes.'
  ];

  return {
    id: `prof-j-${idx + 1}`,
    user_id: user.id,
    interests: [gArea1, gArea2, 'Problem Solving', 'Student Clubs'],
    current_skills: idx % 3 === 0 ? ['Basic Python', 'HTML'] : ['C Basics', 'Logic & Math'],
    guidance_areas: [gArea1, gArea2, gArea3],
    current_goal: goals[idx % goals.length],
    preferred_topics: [gArea1, gArea2],
    created_at: user.created_at
  };
});

// All Users in system
export const ALL_INITIAL_USERS: User[] = [
  DEMO_ADMIN,
  DEMO_COORDINATOR,
  ...MENTORS_USERS,
  ...JUNIORS_USERS
];

// Active and Suggested Matches (18 active matches, 4 suggested)
export const INITIAL_MATCHES: MentorMatch[] = [
  {
    id: 'match-1',
    mentor_id: 'usr-mentor-1', // Aarav Sharma
    junior_id: 'usr-junior-1', // Aditi Deshpande
    match_score: 92.5,
    match_reason: [
      'Same academic discipline: B.Tech CSE',
      'Shared focus on core Programming & DSA fundamentals',
      'Mentor excels in patience-driven problem solving',
      'Compatible weekend evening availability'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-10T10:00:00Z',
    updated_at: '2026-08-10T10:00:00Z'
  },
  {
    id: 'match-2',
    mentor_id: 'usr-mentor-1', // Aarav Sharma
    junior_id: 'usr-junior-2', // Devansh Gupta
    match_score: 88.0,
    match_reason: [
      'Same department (CSE)',
      'Junior requested guidance on C programming and Git',
      'Mentor has strong systems foundation'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-10T10:15:00Z',
    updated_at: '2026-08-10T10:15:00Z'
  },
  {
    id: 'match-3',
    mentor_id: 'usr-mentor-2', // Priya Patel
    junior_id: 'usr-junior-3', // Kavya Sinha
    match_score: 91.0,
    match_reason: [
      'B.Tech CSE alignment',
      'Shared interest in Web Development & Clubs',
      'Mentor has experience balancing exam prep with projects'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-10T10:30:00Z',
    updated_at: '2026-08-10T10:30:00Z'
  },
  {
    id: 'match-4',
    mentor_id: 'usr-mentor-2', // Priya Patel
    junior_id: 'usr-junior-4', // Aryan Chopra
    match_score: 84.5,
    match_reason: [
      'Departmental peer (CSE)',
      'Guidance requested on introductory programming and clubs'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-10T10:45:00Z',
    updated_at: '2026-08-10T10:45:00Z'
  },
  {
    id: 'match-5',
    mentor_id: 'usr-mentor-3', // Rohan Iyer
    junior_id: 'usr-junior-5', // Tanvi Nair
    match_score: 89.0,
    match_reason: [
      'Information Technology program match',
      'Both interested in Data foundations and Python',
      'Mentor provides structured weekly review templates'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-11T09:00:00Z',
    updated_at: '2026-08-11T09:00:00Z'
  },
  {
    id: 'match-6',
    mentor_id: 'usr-mentor-4', // Ananya Verma
    junior_id: 'usr-junior-6', // Manish Bose
    match_score: 90.0,
    match_reason: [
      'Electronics & Communication Engineering match',
      'Guidance on circuit analysis and lab record writing',
      'Mentor has practical lab experience'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-11T09:30:00Z',
    updated_at: '2026-08-11T09:30:00Z'
  },
  {
    id: 'match-7',
    mentor_id: 'usr-mentor-5', // Vikram Rao
    junior_id: 'usr-junior-7', // Simran Kulkarni
    match_score: 87.0,
    match_reason: [
      'Mechanical Engineering discipline match',
      'Shared interest in automotive society & AutoCAD',
      'Mentor leads Baja SAE team'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-11T10:00:00Z',
    updated_at: '2026-08-11T10:00:00Z'
  },
  {
    id: 'match-8',
    mentor_id: 'usr-mentor-6', // Neha Deshmukh
    junior_id: 'usr-junior-8', // Ishaan Jadhav
    match_score: 86.5,
    match_reason: [
      'Biotechnology discipline match',
      'Focus on science writing and coursework management'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-11T11:00:00Z',
    updated_at: '2026-08-11T11:00:00Z'
  },
  {
    id: 'match-9',
    mentor_id: 'usr-mentor-7', // Aditya Nair
    junior_id: 'usr-junior-9', // Rhea Mehta
    match_score: 93.0,
    match_reason: [
      'CSE AI & ML program match',
      'Focus on calculus & linear algebra fundamentals before machine learning'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-12T14:00:00Z',
    updated_at: '2026-08-12T14:00:00Z'
  },
  {
    id: 'match-10',
    mentor_id: 'usr-mentor-8', // Sneha Kulkarni
    junior_id: 'usr-junior-10', // Kunal Bhat
    match_score: 85.0,
    match_reason: [
      'Information Technology program match',
      'Cybersecurity & Linux curiosity from junior'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-12T14:30:00Z',
    updated_at: '2026-08-12T14:30:00Z'
  },
  {
    id: 'match-11',
    mentor_id: 'usr-mentor-9', // Siddharth Sen
    junior_id: 'usr-junior-11', // Shubham Mishra
    match_score: 88.5,
    match_reason: [
      'Electronics & Communication Engineering',
      'Calculus and Digital Logic guidance'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-13T10:00:00Z',
    updated_at: '2026-08-13T10:00:00Z'
  },
  {
    id: 'match-12',
    mentor_id: 'usr-mentor-10', // Pooja Reddy
    junior_id: 'usr-junior-12', // Anika Kapoor
    match_score: 94.0,
    match_reason: [
      'Management Studies BBA Tech match',
      'Focus on public speaking, presentations, and time management'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-13T11:00:00Z',
    updated_at: '2026-08-13T11:00:00Z'
  },
  {
    id: 'match-13',
    mentor_id: 'usr-mentor-11', // Tanmay Joshi
    junior_id: 'usr-junior-13', // Dhruv Tiwari
    match_score: 89.0,
    match_reason: [
      'B.Tech CSE alignment',
      'Junior wants to learn structured problem solving without contest anxiety'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-14T10:00:00Z',
    updated_at: '2026-08-14T10:00:00Z'
  },
  {
    id: 'match-14',
    mentor_id: 'usr-mentor-12', // Ishita Banerjee
    junior_id: 'usr-junior-14', // Suhani Bhattacharya
    match_score: 95.0,
    match_reason: [
      'Design & Media (B.Des) exact program match',
      'Both interested in visual communication & user research'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-14T11:00:00Z',
    updated_at: '2026-08-14T11:00:00Z'
  },
  {
    id: 'match-15',
    mentor_id: 'usr-mentor-13', // Arjun Menon
    junior_id: 'usr-junior-15', // Kartik Ranganathan
    match_score: 83.0,
    match_reason: [
      'Mechanical Engineering match',
      'Exploring hands-on club projects'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-15T12:00:00Z',
    updated_at: '2026-08-15T12:00:00Z'
  },
  {
    id: 'match-16',
    mentor_id: 'usr-mentor-14', // Meera Nambiar
    junior_id: 'usr-junior-16', // Bhavna Pillai
    match_score: 91.5,
    match_reason: [
      'CSE match',
      'Junior wants gentle guidance into web technologies and Git basics'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-15T12:30:00Z',
    updated_at: '2026-08-15T12:30:00Z'
  },
  {
    id: 'match-17',
    mentor_id: 'usr-mentor-15', // Kabir Malhotra
    junior_id: 'usr-junior-17', // Pranav Saxena
    match_score: 86.0,
    match_reason: [
      'IT Department match',
      'Guidance on setting up personal Linux terminal environment'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-16T14:00:00Z',
    updated_at: '2026-08-16T14:00:00Z'
  },
  {
    id: 'match-18',
    mentor_id: 'usr-mentor-16', // Divya Chauhan
    junior_id: 'usr-junior-18', // Vidhi Pandey
    match_score: 87.5,
    match_reason: [
      'ECE Department match',
      'Junior requested help adapting to university workload'
    ],
    status: 'active',
    approved_by: 'usr-admin-1',
    created_at: '2026-08-16T14:30:00Z',
    updated_at: '2026-08-16T14:30:00Z'
  },
  // 4 Suggested Matches (Available in Matching Center for Admin approval!)
  {
    id: 'match-sugg-1',
    mentor_id: 'usr-mentor-17', // Rahul Varma (CSE)
    junior_id: 'usr-junior-19', // Samarth Dutta (CSE)
    match_score: 87.0,
    match_reason: [
      'Same academic discipline (B.Tech CSE)',
      'Shared interest in C language pointers and memory debugging',
      'Mentor has strong systems foundation'
    ],
    status: 'suggested',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'match-sugg-2',
    mentor_id: 'usr-mentor-18', // Ritu Singhania (MGMT)
    junior_id: 'usr-junior-20', // Diya Goyal (MGMT)
    match_score: 92.0,
    match_reason: [
      'Both in Management Studies program',
      'Junior wants guidance on presentation anxiety and group discussions',
      'Mentor won National Youth Parliament speaker prize'
    ],
    status: 'suggested',
    created_at: '2026-09-01T10:30:00Z',
    updated_at: '2026-09-01T10:30:00Z'
  },
  {
    id: 'match-sugg-3',
    mentor_id: 'usr-mentor-19', // Harsh Vardhan (MECH)
    junior_id: 'usr-junior-21', // Yash Kashyap (MECH)
    match_score: 84.0,
    match_reason: [
      'Mechanical Engineering alignment',
      'Guidance on Engineering Graphics / CAD and workshop discipline'
    ],
    status: 'suggested',
    created_at: '2026-09-01T11:00:00Z',
    updated_at: '2026-09-01T11:00:00Z'
  },
  {
    id: 'match-sugg-4',
    mentor_id: 'usr-mentor-20', // Shreya Hegde (BIO)
    junior_id: 'usr-junior-22', // Shruti Chakraborty (BIO)
    match_score: 88.0,
    match_reason: [
      'Biotechnology discipline alignment',
      'Junior wants orientation on reading research papers and lab journals'
    ],
    status: 'suggested',
    created_at: '2026-09-01T11:30:00Z',
    updated_at: '2026-09-01T11:30:00Z'
  }
];

// 32 Realistic Interactions adhering to core philosophy
export const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: 'int-1',
    mentor_id: 'usr-mentor-1', // Aarav Sharma
    junior_id: 'usr-junior-1', // Aditi Deshpande
    interaction_date: '2026-08-15',
    duration: 35,
    interaction_type: 'in_person',
    topics: ['Orientation', 'Coursework', 'C Programming'],
    discussion_summary: 'Discussed initial transition from school to college. Aditi expressed feeling intimidated by classmates who already claim to know multiple programming languages. Aarav shared his own first-semester struggle and emphasized that starting from scratch in C with solid fundamentals is the best path.',
    learning_outcome: 'Aditi understood that comparing with peers is unhelpful. She realized that mastering loops, conditions, and variable scope in C is the only priority this month.',
    next_interaction_date: '2026-08-29',
    created_at: '2026-08-15T16:00:00Z'
  },
  {
    id: 'int-2',
    mentor_id: 'usr-mentor-1',
    junior_id: 'usr-junior-1',
    interaction_date: '2026-08-29',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Arrays & Strings', 'Lab Preparation'],
    discussion_summary: 'Reviewed Aditi’s progress on C arrays and 1D loops. She completed the basic exercises. We discussed how to read lab problem sheets without panicking when test cases fail.',
    learning_outcome: 'Learned dry-running code on paper using pen and table before typing into the IDE.',
    next_interaction_date: '2026-09-12',
    created_at: '2026-08-29T16:30:00Z'
  },
  {
    id: 'int-3',
    mentor_id: 'usr-mentor-1',
    junior_id: 'usr-junior-1',
    interaction_date: '2026-09-12',
    duration: 40,
    interaction_type: 'online',
    topics: ['Mid-Term Prep', 'Pointers Introduction'],
    discussion_summary: 'Aditi felt nervous about Mid-Term Theory exams. Aarav walked through past question patterns and demonstrated memory allocation concepts visually using boxes.',
    learning_outcome: 'Understood that pointer variables simply store memory addresses of other variables. Gained confidence for upcoming mid-term theory.',
    next_interaction_date: '2026-10-03',
    created_at: '2026-09-12T17:00:00Z'
  },
  {
    id: 'int-4',
    mentor_id: 'usr-mentor-1',
    junior_id: 'usr-junior-2',
    interaction_date: '2026-08-18',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Linux Terminal', 'Git Basics'],
    discussion_summary: 'Devansh wanted to set up a developer environment. Advised him to stick with VS Code and standard GCC first rather than installing complex tools.',
    learning_outcome: 'Understood how to compile using `gcc main.c -o app` in the terminal.',
    next_interaction_date: '2026-09-02',
    created_at: '2026-08-18T15:00:00Z'
  },
  {
    id: 'int-5',
    mentor_id: 'usr-mentor-1',
    junior_id: 'usr-junior-2',
    interaction_date: '2026-09-05',
    duration: 35,
    interaction_type: 'online',
    topics: ['Mid-Term Revision', 'Functions in C'],
    discussion_summary: 'Checked Devansh’s understanding of pass-by-value vs pass-by-reference. Gave 2 specific practice problems.',
    learning_outcome: 'Learned how stack frames work during function calls.',
    next_interaction_date: '2026-09-26',
    created_at: '2026-09-05T16:00:00Z'
  },
  {
    id: 'int-6',
    mentor_id: 'usr-mentor-2',
    junior_id: 'usr-junior-3',
    interaction_date: '2026-08-16',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Campus Clubs', 'Time Management'],
    discussion_summary: 'Kavya was overwhelmed by 5 club recruitment drives happening simultaneously. Priya explained the trap of joining too many clubs in semester 1.',
    learning_outcome: 'Decided to apply for only one technical society and maintain focus on academic grade points.',
    next_interaction_date: '2026-08-30',
    created_at: '2026-08-16T11:00:00Z'
  },
  {
    id: 'int-7',
    mentor_id: 'usr-mentor-2',
    junior_id: 'usr-junior-3',
    interaction_date: '2026-08-30',
    duration: 30,
    interaction_type: 'online',
    topics: ['HTML & CSS Basics', 'Web Dev Myths'],
    discussion_summary: 'Priya helped Kavya understand the difference between pure frontend syntax and logic. Recommended building one simple personal page.',
    learning_outcome: 'Learned how semantic HTML tags help structure a webpage.',
    next_interaction_date: '2026-09-15',
    created_at: '2026-08-30T14:00:00Z'
  },
  {
    id: 'int-8',
    mentor_id: 'usr-mentor-3',
    junior_id: 'usr-junior-5',
    interaction_date: '2026-08-17',
    duration: 35,
    interaction_type: 'in_person',
    topics: ['Python Basics', 'Study Habits'],
    discussion_summary: 'Reviewed Tanvi’s daily study schedule. Discussed effective note taking during lectures.',
    learning_outcome: 'Adopted the two-column note-taking system for mathematics and programming.',
    next_interaction_date: '2026-09-01',
    created_at: '2026-08-17T10:00:00Z'
  },
  {
    id: 'int-9',
    mentor_id: 'usr-mentor-4',
    junior_id: 'usr-junior-6',
    interaction_date: '2026-08-18',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Basic Electrical Engg', 'Lab Safety'],
    discussion_summary: 'Manish was anxious about Breadboard connections and Multimeter readings in Basic Electrical Lab. Ananya shared lab safety checklist.',
    learning_outcome: 'Gained confidence in measuring DC voltages and connecting resistors without burning components.',
    next_interaction_date: '2026-09-03',
    created_at: '2026-08-18T11:00:00Z'
  },
  {
    id: 'int-10',
    mentor_id: 'usr-mentor-5',
    junior_id: 'usr-junior-7',
    interaction_date: '2026-08-19',
    duration: 40,
    interaction_type: 'in_person',
    topics: ['Engineering Mechanics', 'Free Body Diagrams'],
    discussion_summary: 'Reviewed free body diagrams for concurrent coplanar forces. Vikram showed common mistakes first-year students make in projection angles.',
    learning_outcome: 'Learned how to consistently set up Cartesian coordinates before taking force moments.',
    next_interaction_date: '2026-09-04',
    created_at: '2026-08-19T14:00:00Z'
  },
  {
    id: 'int-11',
    mentor_id: 'usr-mentor-6',
    junior_id: 'usr-junior-8',
    interaction_date: '2026-08-20',
    duration: 30,
    interaction_type: 'online',
    topics: ['Biotech Lab Records', 'Library Access'],
    discussion_summary: 'Explained how to borrow reference books from the university library and how to write laboratory observation notebooks systematically.',
    learning_outcome: 'Understood proper referencing format for lab manuals.',
    next_interaction_date: '2026-09-08',
    created_at: '2026-08-20T16:00:00Z'
  },
  {
    id: 'int-12',
    mentor_id: 'usr-mentor-7',
    junior_id: 'usr-junior-9',
    interaction_date: '2026-08-21',
    duration: 35,
    interaction_type: 'in_person',
    topics: ['Calculus Foundation', 'AI Career Realities'],
    discussion_summary: 'Rhea was eager to jump straight into neural networks. Aditya patiently explained why Calculus 1 (Limits, Continuity, Partial Derivatives) is essential first.',
    learning_outcome: 'Agreed to master semester 1 calculus before purchasing or enrolling in online deep learning courses.',
    next_interaction_date: '2026-09-07',
    created_at: '2026-08-21T15:30:00Z'
  },
  {
    id: 'int-13',
    mentor_id: 'usr-mentor-8',
    junior_id: 'usr-junior-10',
    interaction_date: '2026-08-22',
    duration: 30,
    interaction_type: 'online',
    topics: ['Linux Environment', 'Overcoming Distractions'],
    discussion_summary: 'Sneha demonstrated how to install Ubuntu inside VirtualBox so Kunal does not risk corrupting his laptop operating system.',
    learning_outcome: 'Successfully ran first five basic Linux commands (`ls`, `cd`, `pwd`, `mkdir`, `cat`).',
    next_interaction_date: '2026-09-09',
    created_at: '2026-08-22T17:00:00Z'
  },
  {
    id: 'int-14',
    mentor_id: 'usr-mentor-9',
    junior_id: 'usr-junior-11',
    interaction_date: '2026-08-23',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Digital Electronics', 'Boolean Algebra'],
    discussion_summary: 'Practiced Karnaugh Maps (K-maps) simplification together on the white board.',
    learning_outcome: 'Mastered 3-variable and 4-variable grouping rules.',
    next_interaction_date: '2026-09-10',
    created_at: '2026-08-23T12:00:00Z'
  },
  {
    id: 'int-15',
    mentor_id: 'usr-mentor-10',
    junior_id: 'usr-junior-12',
    interaction_date: '2026-08-24',
    duration: 45,
    interaction_type: 'in_person',
    topics: ['Presentation Skills', 'Overcoming Stage Fear'],
    discussion_summary: 'Anika had severe anxiety about presenting in front of 60 students in Business Communication class. Pooja shared breathing techniques and structured opening lines.',
    learning_outcome: 'Practiced a 60-second self-introduction with eye contact and steady tone.',
    next_interaction_date: '2026-09-11',
    created_at: '2026-08-24T16:00:00Z'
  },
  {
    id: 'int-16',
    mentor_id: 'usr-mentor-11',
    junior_id: 'usr-junior-13',
    interaction_date: '2026-08-25',
    duration: 30,
    interaction_type: 'online',
    topics: ['Algorithm Practice Routine', 'Patience'],
    discussion_summary: 'Dhruv felt discouraged because solving one simple C program took him 2 hours. Tanmay shared that taking 2 hours at the beginning is completely normal.',
    learning_outcome: 'Replaced frustration with a structured 30-minute attempt rule before seeking hints.',
    next_interaction_date: '2026-09-12',
    created_at: '2026-08-25T18:00:00Z'
  },
  {
    id: 'int-17',
    mentor_id: 'usr-mentor-12',
    junior_id: 'usr-junior-14',
    interaction_date: '2026-08-26',
    duration: 35,
    interaction_type: 'in_person',
    topics: ['Design Observation', 'Sketching Notebook'],
    discussion_summary: 'Ishita showed Suhani how to maintain an everyday observation sketchbook for Interaction Design.',
    learning_outcome: 'Learned to observe physical door handles, elevator buttons, and signboards for affordance and usability.',
    next_interaction_date: '2026-09-14',
    created_at: '2026-08-26T11:30:00Z'
  },
  {
    id: 'int-18',
    mentor_id: 'usr-mentor-14',
    junior_id: 'usr-junior-16',
    interaction_date: '2026-08-27',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Git Version Control', 'Backing Up Code'],
    discussion_summary: 'Bhavna had lost her first lab assignment when her USB drive corrupted. Meera taught her how to push code to GitHub as a safe cloud backup.',
    learning_outcome: 'Learned `git init`, `git add`, `git commit` and `git push`.',
    next_interaction_date: '2026-09-16',
    created_at: '2026-08-27T15:00:00Z'
  },
  // Inactive / Needs Attention Example (More than 21 days ago)
  {
    id: 'int-19',
    mentor_id: 'usr-mentor-13', // Arjun Menon
    junior_id: 'usr-junior-15', // Kartik Ranganathan
    interaction_date: '2026-08-16', // > 40 days ago! Needs attention!
    duration: 25,
    interaction_type: 'phone',
    topics: ['General Check-in'],
    discussion_summary: 'Brief phone call regarding workshop kit purchase. Scheduled follow up was missed.',
    learning_outcome: 'Identified required safety shoes and workshop apron.',
    next_interaction_date: '2026-08-30',
    created_at: '2026-08-16T12:00:00Z'
  },
  {
    id: 'int-20',
    mentor_id: 'usr-mentor-2',
    junior_id: 'usr-junior-4',
    interaction_date: '2026-09-02',
    duration: 30,
    interaction_type: 'in_person',
    topics: ['Coursework Revision'],
    discussion_summary: 'Aryan reviewed his physics mid-term syllabus and cleared doubts on wave optics.',
    learning_outcome: 'Solved three numerical problems on interference fringes.',
    next_interaction_date: '2026-09-20',
    created_at: '2026-09-02T14:00:00Z'
  }
];

// Action Items (Max 2 per interaction, with due dates and statuses)
export const INITIAL_ACTIONS: ActionItem[] = [
  // Linked to interaction 1 (Aditi)
  {
    id: 'act-1',
    interaction_id: 'int-1',
    junior_id: 'usr-junior-1',
    description: 'Write and run 5 basic C programs using loops (while & for) on your own without looking at solutions.',
    due_date: '2026-08-25',
    status: 'completed',
    completed_at: '2026-08-24T18:00:00Z',
    created_at: '2026-08-15T16:00:00Z'
  },
  {
    id: 'act-2',
    interaction_id: 'int-1',
    junior_id: 'usr-junior-1',
    description: 'Create a single folder on your desktop with dates for all lab assignment solutions.',
    due_date: '2026-08-20',
    status: 'completed',
    completed_at: '2026-08-18T10:00:00Z',
    created_at: '2026-08-15T16:00:00Z'
  },
  // Linked to interaction 2 (Aditi)
  {
    id: 'act-3',
    interaction_id: 'int-2',
    junior_id: 'usr-junior-1',
    description: 'Practice dry-running 3 array search problems on paper before coding them in the lab.',
    due_date: '2026-09-05',
    status: 'completed',
    completed_at: '2026-09-04T19:30:00Z',
    created_at: '2026-08-29T16:30:00Z'
  },
  {
    id: 'act-4',
    interaction_id: 'int-2',
    junior_id: 'usr-junior-1',
    description: 'Read Chapter 4 of C Programming textbook on String character arrays.',
    due_date: '2026-09-08',
    status: 'completed',
    completed_at: '2026-09-07T21:00:00Z',
    created_at: '2026-08-29T16:30:00Z'
  },
  // Linked to interaction 3 (Aditi) - Current Active Actions!
  {
    id: 'act-5',
    interaction_id: 'int-3',
    junior_id: 'usr-junior-1',
    description: 'Solve the previous year Mid-Term question paper for Computer Programming under timed conditions.',
    due_date: '2026-09-28',
    status: 'in_progress',
    created_at: '2026-09-12T17:00:00Z'
  },
  {
    id: 'act-6',
    interaction_id: 'int-3',
    junior_id: 'usr-junior-1',
    description: 'Draw pointer memory diagram for swapping two integers using pointers in your notebook.',
    due_date: '2026-09-30',
    status: 'pending',
    created_at: '2026-09-12T17:00:00Z'
  },
  // Linked to Devansh
  {
    id: 'act-7',
    interaction_id: 'int-4',
    junior_id: 'usr-junior-2',
    description: 'Configure GCC compiler in terminal and verify by compiling a hello world executable.',
    due_date: '2026-08-22',
    status: 'completed',
    completed_at: '2026-08-21T14:00:00Z',
    created_at: '2026-08-18T15:00:00Z'
  },
  {
    id: 'act-8',
    interaction_id: 'int-5',
    junior_id: 'usr-junior-2',
    description: 'Implement recursive factorial and Fibonacci functions in C with base cases.',
    due_date: '2026-09-15',
    status: 'completed',
    completed_at: '2026-09-14T20:00:00Z',
    created_at: '2026-09-05T16:00:00Z'
  },
  // Overdue Action Example (To test Attention Required alert!)
  {
    id: 'act-9',
    interaction_id: 'int-19',
    junior_id: 'usr-junior-15', // Kartik Ranganathan
    description: 'Submit verified workshop safety form to Department Mechanical Lab Assistant.',
    due_date: '2026-08-25', // Overdue!
    status: 'overdue',
    created_at: '2026-08-16T12:00:00Z'
  },
  // Other action items
  {
    id: 'act-10',
    interaction_id: 'int-6',
    junior_id: 'usr-junior-3',
    description: 'Attend the introductory workshop of the university Coding Club only and skip others.',
    due_date: '2026-08-28',
    status: 'completed',
    completed_at: '2026-08-27T17:00:00Z',
    created_at: '2026-08-16T11:00:00Z'
  },
  {
    id: 'act-11',
    interaction_id: 'int-7',
    junior_id: 'usr-junior-3',
    description: 'Create a simple personal profile webpage with 3 sections using raw HTML and CSS.',
    due_date: '2026-09-10',
    status: 'completed',
    completed_at: '2026-09-09T18:00:00Z',
    created_at: '2026-08-30T14:00:00Z'
  },
  {
    id: 'act-12',
    interaction_id: 'int-15',
    junior_id: 'usr-junior-12',
    description: 'Record a 2-minute video on your phone explaining any business concept and review it for filler words.',
    due_date: '2026-09-05',
    status: 'completed',
    completed_at: '2026-09-04T12:00:00Z',
    created_at: '2026-08-24T16:00:00Z'
  },
  {
    id: 'act-13',
    interaction_id: 'int-12',
    junior_id: 'usr-junior-9',
    description: 'Complete 10 derivative chain rule practice problems from Thomas Calculus.',
    due_date: '2026-09-01',
    status: 'completed',
    completed_at: '2026-08-31T20:00:00Z',
    created_at: '2026-08-21T15:30:00Z'
  }
];

// Monthly Junior Pulses (5-Question Responses)
export const INITIAL_PULSES: MonthlyPulse[] = [
  {
    id: 'pulse-1',
    junior_id: 'usr-junior-1', // Aditi Deshpande
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 5,
    goal_clarity_rating: 5,
    previous_action_completed: true,
    next_guidance_request: 'Guidance on preparing for the upcoming Mid-Term exam format and pointer concepts.',
    submitted_at: '2026-08-31T18:00:00Z'
  },
  {
    id: 'pulse-2',
    junior_id: 'usr-junior-2', // Devansh Gupta
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 4,
    goal_clarity_rating: 4,
    previous_action_completed: true,
    next_guidance_request: 'How to write modular C code with multiple header files.',
    submitted_at: '2026-08-31T19:00:00Z'
  },
  {
    id: 'pulse-3',
    junior_id: 'usr-junior-3', // Kavya Sinha
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 5,
    goal_clarity_rating: 4,
    previous_action_completed: true,
    next_guidance_request: 'Advice on balancing semester assignments with club project deadlines.',
    submitted_at: '2026-08-31T20:00:00Z'
  },
  {
    id: 'pulse-4',
    junior_id: 'usr-junior-6', // Manish Bose
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 4,
    goal_clarity_rating: 4,
    previous_action_completed: true,
    next_guidance_request: 'Doubts regarding Network Theorems in Basic Electrical Engineering.',
    submitted_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'pulse-5',
    junior_id: 'usr-junior-7', // Simran Kulkarni
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 4,
    goal_clarity_rating: 5,
    previous_action_completed: true,
    next_guidance_request: 'Friction and truss analysis problems in Engineering Mechanics.',
    submitted_at: '2026-09-01T11:00:00Z'
  },
  {
    id: 'pulse-6',
    junior_id: 'usr-junior-12', // Anika Kapoor
    month: '2026-08',
    interaction_completed: true,
    usefulness_rating: 5,
    goal_clarity_rating: 5,
    previous_action_completed: true,
    next_guidance_request: 'How to prepare visual slides without cluttering with paragraphs of text.',
    submitted_at: '2026-09-01T12:00:00Z'
  },
  // Low feedback score example (To test Attention Required alert!)
  {
    id: 'pulse-7',
    junior_id: 'usr-junior-15', // Kartik Ranganathan
    month: '2026-08',
    interaction_completed: false,
    usefulness_rating: 2,
    goal_clarity_rating: 2,
    previous_action_completed: false,
    next_guidance_request: 'Need help re-connecting with mentor. Missed phone call and unsure about lab schedule.',
    submitted_at: '2026-09-02T15:00:00Z'
  }
];

// Realistic Escalations covering various categories & stages
export const INITIAL_ESCALATIONS: Escalation[] = [
  {
    id: 'esc-1',
    raised_by: 'usr-mentor-1', // Aarav Sharma
    junior_id: 'usr-junior-2', // Devansh Gupta
    category: 'academic',
    severity: 'medium',
    description: 'Devansh has been struggling significantly with Engineering Mathematics-1 mid-term preparation and scored very low in internal quiz 1. Needs remedial guidance or faculty consultation.',
    assigned_to: 'usr-coord-1', // Dr. Sunita Raman
    status: 'under_review',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-12T14:00:00Z'
  },
  {
    id: 'esc-2',
    raised_by: 'usr-junior-15', // Kartik Ranganathan
    junior_id: 'usr-junior-15',
    category: 'personal',
    severity: 'high',
    description: 'Student experiencing severe homesickness, anxiety, and trouble sleeping in hostel. Requested guidance on counseling support.',
    assigned_to: 'usr-admin-1', // Prof. Sundaram (Dean of Student Welfare)
    status: 'referred',
    resolution: 'Referred to University Student Counselling Centre (Room 104, Health Centre). Dr. Ananya Sen scheduled a confidential counseling session on Sept 18.',
    created_at: '2026-09-05T09:30:00Z',
    updated_at: '2026-09-06T11:00:00Z'
  },
  {
    id: 'esc-3',
    raised_by: 'usr-mentor-4', // Ananya Verma
    junior_id: 'usr-junior-6', // Manish Bose
    category: 'academic',
    severity: 'low',
    description: 'Manish missed two consecutive lab submissions due to temporary illness. Requested extension from department coordinator.',
    assigned_to: 'usr-coord-1',
    status: 'resolved',
    resolution: 'Medical certificate reviewed and approved by HOD. Makeup lab slot allocated on Saturday Sept 20.',
    created_at: '2026-08-25T14:00:00Z',
    updated_at: '2026-08-28T16:00:00Z',
    resolved_at: '2026-08-28T16:00:00Z'
  },
  {
    id: 'esc-4',
    raised_by: 'usr-mentor-3', // Rohan Iyer
    junior_id: 'usr-junior-5', // Tanvi Nair
    category: 'safety',
    severity: 'critical',
    description: 'Student reported poor street lighting and safety concern on the northern walkway near the girls hostel gate after 8:30 PM.',
    assigned_to: 'usr-admin-1',
    status: 'under_review',
    created_at: '2026-09-18T20:00:00Z',
    updated_at: '2026-09-19T09:00:00Z'
  }
];

// 5 Inspirational Success Stories across diverse categories
export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    student_id: 'usr-junior-1', // Aditi Deshpande
    mentor_id: 'usr-mentor-1', // Aarav Sharma
    title: 'From Zero Coding Confidence to Acing First C Lab Test',
    description: 'How simple dry-running habits and patience helped a first-generation engineering student conquer fear of programming syntax.',
    before_state: 'Aditi had never written a single line of code in school. Seeing classmates who already knew Java and Python made her feel deeply alienated and convinced that engineering was a mistake.',
    action_taken: 'Mentor Aarav Sharma instituted a strict "pen and paper first" rule. Rather than letting Aditi copy-paste code or get lost in complex tutorials, they broke down while-loops, logic conditions, and memory tables in 30-minute focused sessions.',
    outcome: 'Aditi scored 95/100 on her first internal C programming laboratory assessment and now assists two of her bench-mates in lab sessions.',
    category: 'academic_improvement',
    status: 'published',
    approved_by: 'usr-admin-1',
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-16T12:00:00Z'
  },
  {
    id: 'story-2',
    student_id: 'usr-junior-3', // Kavya Sinha
    mentor_id: 'usr-mentor-2', // Priya Patel
    title: 'Avoiding the First-Semester Club Burnout Trap',
    description: 'Learning to say no to five different student clubs to build academic rhythm and deploy a first personal web project.',
    before_state: 'Kavya had signed up for 5 cultural and technical society inductions, resulting in late-night meetings, missed 8 AM lectures, and high stress.',
    action_taken: 'Senior mentor Priya Patel shared her own first-year mistakes and helped Kavya prioritize: stay in one technical society only and dedicate 2 fixed hours every Sunday morning to building an HTML/CSS portfolio.',
    outcome: 'Successfully launched a personal portfolio page hosted on GitHub Pages and maintained 100% attendance in morning lectures.',
    category: 'skill_developed',
    status: 'published',
    approved_by: 'usr-admin-1',
    created_at: '2026-09-12T14:00:00Z',
    updated_at: '2026-09-13T10:00:00Z'
  },
  {
    id: 'story-3',
    student_id: 'usr-junior-12', // Anika Kapoor
    mentor_id: 'usr-mentor-10', // Pooja Reddy
    title: 'Conquering Classroom Stage Fear in Management Seminars',
    description: 'Transforming paralyzing presentation anxiety into confident delivery during BBA case discussions.',
    before_state: 'Anika would skip class or experience severe palpitations whenever the professor announced impromptu case presentation sessions.',
    action_taken: 'Mentor Pooja Reddy organized two 1-on-1 mock presentation rehearsals using 60-second opening frameworks and eye contact anchoring techniques.',
    outcome: 'Delivered her team’s mid-term case presentation smoothly and was nominated by her section as their study group discussion lead.',
    category: 'communication_improvement',
    status: 'published',
    approved_by: 'usr-admin-1',
    created_at: '2026-09-10T16:00:00Z',
    updated_at: '2026-09-11T11:00:00Z'
  },
  {
    id: 'story-4',
    student_id: 'usr-junior-2', // Devansh Gupta
    mentor_id: 'usr-mentor-1', // Aarav Sharma
    title: 'Building a Command Line Calculator and Demystifying Linux',
    description: 'Setting up a local development environment without getting trapped in endless YouTube tutorials.',
    before_state: 'Devansh struggled with broken compiler paths, corrupted IDE installs, and felt intimidated by terminal prompts.',
    action_taken: 'Mentor Aarav walked him through clean installation of GCC and Git on a native terminal in under 20 minutes.',
    outcome: 'Built and open-sourced a mini CLI calculator in C with over 15 commits, creating his first GitHub repository.',
    category: 'project_completed',
    status: 'submitted',
    created_at: '2026-09-18T11:00:00Z'
  },
  {
    id: 'story-5',
    student_id: 'usr-junior-7', // Simran Kulkarni
    mentor_id: 'usr-mentor-5', // Vikram Rao
    title: 'Visualizing Mechanics: Free Body Diagrams to Engineering Precision',
    description: 'Overcoming fear of engineering physics vectors and joining the college automotive design club.',
    before_state: 'Simran struggled to visualize 3D force vectors and was considering dropping out of the collegiate mechanical design club induction.',
    action_taken: 'Mentor Vikram used physical models from the CAD lab to demonstrate moment of inertia and force balance principles.',
    outcome: 'Passed the technical evaluation round for the collegiate Baja design team and cleared internal mechanics quiz with an A grade.',
    category: 'opportunity_pursued',
    status: 'draft',
    created_at: '2026-09-20T09:00:00Z'
  }
];

// Initial In-App Notifications
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'usr-junior-1',
    title: 'Upcoming Mentoring Check-in',
    message: 'Your next guidance check-in with Aarav Sharma is scheduled for Oct 03.',
    type: 'info',
    read: false,
    created_at: '2026-09-20T10:00:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'usr-junior-1',
    title: 'Action Item Reminder',
    message: 'You have 1 action item due on Sept 30: "Draw pointer memory diagram in your notebook".',
    type: 'warning',
    read: false,
    created_at: '2026-09-21T09:00:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'usr-mentor-1',
    title: 'Monthly Pulse Response Received',
    message: 'Aditi Deshpande submitted her monthly feedback rating 5/5 for guidance clarity.',
    type: 'success',
    read: true,
    created_at: '2026-08-31T18:05:00Z'
  },
  {
    id: 'notif-4',
    user_id: 'usr-admin-1',
    title: 'Attention Required: Inactive Mentor Group',
    message: 'Group (Arjun Menon - Kartik Ranganathan) has had no interaction recorded for over 21 days.',
    type: 'alert',
    read: false,
    created_at: '2026-09-22T08:00:00Z'
  },
  {
    id: 'notif-5',
    user_id: 'usr-coord-1',
    title: 'New Academic Escalation Assigned',
    message: 'Aarav Sharma raised an academic support escalation for Devansh Gupta.',
    type: 'warning',
    read: false,
    created_at: '2026-09-10T11:05:00Z'
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    user_id: 'usr-admin-1',
    user_name: 'Prof. Rajesh K. Sundaram',
    action: 'MATCH_APPROVED',
    entity_type: 'mentor_matches',
    entity_id: 'match-1',
    metadata: { mentor: 'Aarav Sharma', junior: 'Aditi Deshpande', score: 92.5 },
    created_at: '2026-08-10T10:00:00Z'
  },
  {
    id: 'audit-2',
    user_id: 'usr-mentor-1',
    user_name: 'Aarav Sharma',
    action: 'INTERACTION_RECORDED',
    entity_type: 'interactions',
    entity_id: 'int-1',
    metadata: { junior: 'Aditi Deshpande', duration: 35, type: 'in_person' },
    created_at: '2026-08-15T16:00:00Z'
  },
  {
    id: 'audit-3',
    user_id: 'usr-junior-1',
    user_name: 'Aditi Deshpande',
    action: 'ACTION_COMPLETED',
    entity_type: 'action_items',
    entity_id: 'act-1',
    metadata: { description: 'Write and run 5 basic C programs using loops' },
    created_at: '2026-08-24T18:00:00Z'
  },
  {
    id: 'audit-4',
    user_id: 'usr-mentor-1',
    user_name: 'Aarav Sharma',
    action: 'ESCALATION_RAISED',
    entity_type: 'escalations',
    entity_id: 'esc-1',
    metadata: { category: 'academic', severity: 'medium', junior: 'Devansh Gupta' },
    created_at: '2026-09-10T11:00:00Z'
  },
  {
    id: 'audit-5',
    user_id: 'usr-admin-1',
    user_name: 'Prof. Rajesh K. Sundaram',
    action: 'SUCCESS_STORY_APPROVED',
    entity_type: 'success_stories',
    entity_id: 'story-1',
    metadata: { title: 'From Zero Coding Confidence to Acing First C Lab Test' },
    created_at: '2026-09-16T12:00:00Z'
  },
  {
    id: 'audit-6',
    user_id: 'usr-admin-1',
    user_name: 'Prof. Rajesh K. Sundaram',
    action: 'CONFIG_UPDATED',
    entity_type: 'program_settings',
    entity_id: 'settings-1',
    metadata: { interaction_threshold_days: 21, max_juniors_per_mentor: 3 },
    created_at: '2026-09-01T09:00:00Z'
  }
];
