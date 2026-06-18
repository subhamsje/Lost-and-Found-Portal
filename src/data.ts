import { Item, SuccessStory, UniversityStat } from './types';

export const CAMPUS_LOCATIONS = [
  'CS Department (CSE Block)',
  'Main Football Ground',
  'IEM Department Building',
  'DSCE Rock Garden Area',
  'CD Sagar Auditorium Lobby',
  'Dayananda Sagar Pre-University College Block',
  'Inner Campus Road',
  'College Central Library'
];

export const CATEGORIES = [
  'Electronics',
  'Keys',
  'Accessories',
  'Valuables',
  'Study Gear',
  'Clothing',
  'Documents'
] as const;

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-1',
    title: 'AirPods Pro Max',
    description: 'Space Gray finish, left cup has a minor nick. It was inside a black mesh carrying shield. Extremely important for my thesis writing sessions!',
    category: 'Electronics',
    location: 'College Central Library',
    dateReported: '2026-06-15T14:30:00Z',
    status: 'lost',
    reward: '$40 & Starbucks Coffee',
    contactEmail: 'taylor.fields@dsce.edu.in',
    founderOrLoserName: 'Taylor Fields',
    accentColor: 'violet',
    icon: '🎧',
    specs: 'Serial ending in 9X2J. Light scratching on right hinge.',
    views: 142
  },
  {
    id: 'item-2',
    title: 'Cartier Love Ring (Gold)',
    description: 'Found a solid gold Cartier ring on the outer rim of the fountain. It has a tiny engraving on the interior band that says "Always - E & M".',
    category: 'Valuables',
    location: 'CD Sagar Auditorium Lobby',
    dateReported: '2026-06-15T09:12:00Z',
    status: 'found',
    contactEmail: 'reception.auditorium@dsce.edu.in',
    founderOrLoserName: 'Prof. Marcus Vance',
    accentColor: 'amber',
    icon: '💍',
    specs: 'Interior band engraving confirms ownership list.',
    views: 310
  },
  {
    id: 'item-3',
    title: 'Porsche Key Fob with Carabiner',
    description: 'Found a 911 smart key attached to a heavy-duty titanium subgrid carabiner. Also has an NFC campus access chip attached.',
    category: 'Keys',
    location: 'Inner Campus Road',
    dateReported: '2026-06-14T18:45:00Z',
    status: 'found',
    contactEmail: 'sec.patrol@dsce.edu.in',
    founderOrLoserName: 'Campus Security',
    accentColor: 'rose',
    icon: '🔑',
    specs: 'Has three distinct metallic keys beside the remote transmitter.',
    views: 95
  },
  {
    id: 'item-4',
    title: 'Arc\'teryx Beta Jacket',
    description: 'Beta LT model in Dark Green, size Medium. Left sleeve pocket has a pack of sugar-free mints. Forgot it on the back of chair #14 during lecture.',
    category: 'Clothing',
    location: 'CS Department (CSE Block)',
    dateReported: '2026-06-14T11:00:00Z',
    status: 'lost',
    reward: '$25 Cash',
    contactEmail: 'liam.chen@dsce.edu.in',
    founderOrLoserName: 'Liam Chen',
    accentColor: 'emerald',
    icon: '🧥',
    specs: 'Minor tear inside neck loop hook.',
    views: 68
  },
  {
    id: 'item-5',
    title: 'iPad Pro 11" M4 + Pencil',
    description: 'We have fully reunited this beautiful asset! Student reported it lost in Science Lab, and Lab Assistant found and returned it within 45 minutes.',
    category: 'Electronics',
    location: 'DSCE Rock Garden Area',
    dateReported: '2026-06-13T10:20:00Z',
    status: 'reunited',
    contactEmail: 'sarah.v@dsce.edu.in',
    founderOrLoserName: 'Sarah Jenkins',
    accentColor: 'cyan',
    icon: '📱',
    specs: 'Matte screen protector and customized blue smart folio.',
    views: 289
  },
  {
    id: 'item-6',
    title: 'Peak Design Backpack',
    description: '30L Everyday Backpack, Charcoal gray. Inside contains a green spiral notebook and some graphite drafting leads. Lost in the cafeteria area.',
    category: 'Accessories',
    location: 'Main Football Ground',
    dateReported: '2026-06-13T16:15:00Z',
    status: 'lost',
    reward: '$50',
    contactEmail: 'clara.wood@dsce.edu.in',
    founderOrLoserName: 'Clara Wood',
    accentColor: 'blue',
    icon: '🎒',
    specs: 'Equipped with a blue Peak Design camera clip on the strap.',
    views: 112
  },
  {
    id: 'item-7',
    title: 'Sennheiser Accentum Headset',
    description: 'Found black Sennheiser over-ear headphones on a bench near the quad trees. Sound works perfectly, charging port has a tiny rubber cap.',
    category: 'Electronics',
    location: 'Dayananda Sagar Pre-University College Block',
    dateReported: '2026-06-12T08:30:00Z',
    status: 'found',
    contactEmail: 'alex.ross@dsce.edu.in',
    founderOrLoserName: 'Alex Ross',
    accentColor: 'violet',
    icon: '🎧',
    specs: 'Firmware name registered as "Alex\'s Accentum".',
    views: 54
  },
  {
    id: 'item-8',
    title: 'TI-84 Plus CE Python Edition',
    description: 'Reunited! Returned to owner. Reunited in humanities study space.',
    category: 'Study Gear',
    location: 'CS Department (CSE Block)',
    dateReported: '2026-06-11T12:00:00Z',
    status: 'reunited',
    contactEmail: 'mason.k@dsce.edu.in',
    founderOrLoserName: 'Mason King',
    accentColor: 'blue',
    icon: '🧮',
    specs: 'Initials "M.K." laser etched into the slide cover.',
    views: 180
  }
];

export const INITIAL_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    title: 'Saved my master thesis from oblivion!',
    itemTitle: 'MacBook Pro 16"',
    description: 'I left my laptop on the library window sill just hours before local backup. I thought my whole semester of intensive code was gone forever. A library worker listed it on CampusFind, and I had it back in my lap in 25 minutes flat. You guys are heroes.',
    author: 'Elena Rostova (Grad Student)',
    dateReunited: '2 days ago',
    emoji: '💻',
    accent: 'violet'
  },
  {
    id: 'story-2',
    title: 'Returned heirloom ring in under an hour',
    itemTitle: 'Diamond Solitaire Ring',
    description: 'I lost my grandmother\'s gold engagement ring near the Humanities courtyard. I was in absolute tears. Fortunately, an engineering student noticed it shimmering near the drain and posted it on CampusFind immediately. Absolute golden community!',
    author: 'Sophia Martinez (Fine Arts Senior)',
    dateReunited: '1 week ago',
    emoji: '✨',
    accent: 'amber'
  },
  {
    id: 'story-3',
    title: 'Wallet returned with all cash untouched',
    itemTitle: 'Bellroy Leather Wallet',
    description: 'Left my wallet in the athletic lockers with $120 rent cash. A track coach found it, matched it against my student ID on CampusFind, and messaged me in class. This portal is incredibly secure and fast!',
    author: 'Daniel Cooper (Sophomore)',
    dateReunited: '3 days ago',
    emoji: '💼',
    accent: 'emerald'
  }
];

export const UNIVERSITY_STATS: UniversityStat[] = [
  {
    label: 'Items Recovered En-route',
    value: 684,
    trend: '+12% this week',
    isPositive: true,
    color: 'violet'
  },
  {
    label: 'Portal Active Members',
    value: 8412,
    trend: '94% of student body',
    isPositive: true,
    color: 'blue'
  },
  {
    label: 'Avg. Resolution Time',
    value: 3.8,
    suffix: ' hrs',
    trend: '-1.2h improvement',
    isPositive: true,
    color: 'cyan'
  },
  {
    label: 'Rewards Distributed',
    value: 2350,
    suffix: ' $',
    trend: 'Peer-to-peer gratitude',
    isPositive: true,
    color: 'emerald'
  }
];
