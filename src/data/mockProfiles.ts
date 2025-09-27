// Mock data for profiles
export const mockProfiles = [
  {
    id: 1,
    name: 'Grace',
    age: 25,
    location: 'Lagos, Nigeria',
    profilePicture: '/divine-effiong-e2IbONoKXI4-unsplash.jpg',
    lookingFor: 'Life Partner',
    icebreaker: 'Loves leading worship on Sundays',
    denomination: 'Pentecostal',
    faithLevel: 'Passionate',
    distance: '2.5km away',
    isOnline: true,
    verse: 'Proverbs 31:10',
    hobbies: ['Worship', 'Reading', 'Cooking']
  },
  {
    id: 2,
    name: 'David',
    age: 28,
    location: 'Abuja, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    lookingFor: 'Friendship First',
    icebreaker: 'Youth pastor who loves adventure',
    denomination: 'Baptist',
    faithLevel: 'Rooted',
    distance: '5.1km away',
    isOnline: false,
    verse: 'Philippians 4:13',
    hobbies: ['Sports', 'Ministry', 'Travel']
  },
  {
    id: 3,
    name: 'Faith',
    age: 23,
    location: 'Port Harcourt, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
    lookingFor: 'Marriage Partner',
    icebreaker: 'Bible study enthusiast and baker',
    denomination: 'Anglican',
    faithLevel: 'Growing',
    distance: '1.8km away',
    isOnline: true,
    verse: 'Jeremiah 29:11',
    hobbies: ['Baking', 'Bible Study', 'Art']
  },
  {
    id: 4,
    name: 'Emmanuel',
    age: 30,
    location: 'Kano, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop',
    lookingFor: 'Life Partner',
    icebreaker: 'Church musician and engineer',
    denomination: 'Pentecostal',
    faithLevel: 'Passionate',
    distance: '12km away',
    isOnline: true,
    verse: 'Psalm 37:4',
    hobbies: ['Music', 'Engineering', 'Photography']
  },
  {
    id: 5,
    name: 'Joy',
    age: 26,
    location: 'Ibadan, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop',
    lookingFor: 'Friendship First',
    icebreaker: 'Sunday school teacher with a heart for kids',
    denomination: 'Methodist',
    faithLevel: 'Rooted',
    distance: '8.5km away',
    isOnline: false,
    verse: 'Isaiah 40:31',
    hobbies: ['Teaching', 'Dancing', 'Crafts']
  },
  {
    id: 6,
    name: 'Samuel',
    age: 27,
    location: 'Enugu, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
    lookingFor: 'Marriage Partner',
    icebreaker: 'Doctor with a servant heart',
    denomination: 'Catholic',
    faithLevel: 'Passionate',
    distance: '3.2km away',
    isOnline: true,
    verse: 'Matthew 5:16',
    hobbies: ['Medicine', 'Volunteering', 'Reading']
  },
  {
    id: 7,
    name: 'Peace',
    age: 24,
    location: 'Calabar, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop',
    lookingFor: 'Life Partner',
    icebreaker: 'Worship leader and graphic designer',
    denomination: 'Pentecostal',
    faithLevel: 'Growing',
    distance: '6.7km away',
    isOnline: true,
    verse: 'Romans 8:28',
    hobbies: ['Design', 'Worship', 'Photography']
  },
  {
    id: 8,
    name: 'Daniel',
    age: 29,
    location: 'Jos, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop',
    lookingFor: 'Marriage Partner',
    icebreaker: 'Bible scholar and teacher',
    denomination: 'Baptist',
    faithLevel: 'Passionate',
    distance: '15km away',
    isOnline: false,
    verse: 'Joshua 1:9',
    hobbies: ['Teaching', 'Research', 'Hiking']
  },
  {
    id: 9,
    name: 'Hope',
    age: 22,
    location: 'Warri, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
    lookingFor: 'Friendship First',
    icebreaker: 'Social worker with passion for justice',
    denomination: 'Anglican',
    faithLevel: 'Growing',
    distance: '4.3km away',
    isOnline: true,
    verse: 'Micah 6:8',
    hobbies: ['Social Work', 'Reading', 'Community Service']
  },
  {
    id: 10,
    name: 'Peter',
    age: 31,
    location: 'Maiduguri, Nigeria',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
    lookingFor: 'Life Partner',
    icebreaker: 'Business owner and church elder',
    denomination: 'Presbyterian',
    faithLevel: 'Rooted',
    distance: '9.8km away',
    isOnline: false,
    verse: 'Proverbs 3:5-6',
    hobbies: ['Business', 'Mentoring', 'Chess']
  }
];

export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profilePicture: string;
  lookingFor: string;
  icebreaker: string;
  denomination: string;
  faithLevel: string;
  distance: string;
  isOnline: boolean;
  verse: string;
  hobbies: string[];
}