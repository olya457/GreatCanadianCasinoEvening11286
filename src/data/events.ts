import { Event } from '../types';
import { config } from './config';

export const events: Event[] = [
  {
    id: 'event-1',
    title: 'The Golden Hour',
    venueId: 'restaurant',
    date: '09-26',
    time: '7:00 PM–10:30 PM',
    summary:
      'An elegant evening of cocktails, dining, and behind-the-scenes casino experiences.',
    description: [
      'The Golden Hour brings together refined dining, signature cocktails, and an exclusive introduction to the casino complex. Guests can enjoy a guided bar experience before moving into a chef-led dinner and private casino tour.',
      'The evening is designed for guests who want to explore several experiences in one programme. A premium dress code is recommended, and advance registration is required.',
    ],
    schedule: [
      {
        time: '7:00 PM',
        title: 'Welcome Cocktail',
      },
      {
        time: '7:30 PM',
        title: 'Bar Masterclass',
      },
      {
        time: '8:30 PM',
        title: 'Chef’s Table',
      },
      {
        time: '9:30 PM',
        title: 'Tour',
      },
      {
        time: '10:30 PM',
        title: 'Evening Finale',
      },
    ],
    startAt: `${config.eventYear}-09-26T19:00:00-04:00`,
    endAt: `${config.eventYear}-09-26T22:30:00-04:00`,
    image: require('../assets/event-golden-hour.png'),
  },
  {
    id: 'event-2',
    title: 'Chef’s Table Experience',
    venueId: 'restaurant',
    date: '09-27',
    time: '6:30 PM–9:30 PM',
    summary:
      'A chef-led dining experience featuring seasonal ingredients and carefully paired wines.',
    description: [
      'Chef’s Table Experience invites guests to enjoy an intimate multi-course dinner prepared in front of them. Each course is introduced by the chef and paired with a selected wine.',
      'The evening focuses on presentation, flavour, and conversation. Seating is limited to create a more personal restaurant experience.',
    ],
    schedule: [
      {
        time: '6:30 PM',
        title: 'Guest Arrival',
      },
      {
        time: '7:00 PM',
        title: 'Chef Introduction',
      },
      {
        time: '7:30 PM',
        title: 'Tasting Course One',
      },
      {
        time: '8:15 PM',
        title: 'Main Course',
      },
      {
        time: '9:00 PM',
        title: 'Dessert and Wine Pairing',
      },
    ],
    startAt: `${config.eventYear}-09-27T18:30:00-04:00`,
    endAt: `${config.eventYear}-09-27T21:30:00-04:00`,
    image: require('../assets/event-chefs-table.png'),
  },
  {
    id: 'event-3',
    title: 'Wine and Flavours Workshop',
    venueId: 'restaurant',
    date: '09-28',
    time: '5:00 PM–7:30 PM',
    summary:
      'Discover the art of wine pairing through an interactive tasting workshop.',
    description: [
      'Wine and Flavours Workshop introduces guests to the basics of pairing wine with selected dishes and ingredients. Participants taste several combinations and learn how aroma, texture, and acidity influence the experience.',
      'The workshop is suitable for beginners and experienced wine lovers. All tasting materials are provided at the venue.',
    ],
    schedule: [
      {
        time: '5:00 PM',
        title: 'Welcome Pour',
      },
      {
        time: '5:20 PM',
        title: 'Introduction to Pairing',
      },
      {
        time: '6:00 PM',
        title: 'Guided Tasting',
      },
      {
        time: '6:45 PM',
        title: 'Flavour Challenge',
      },
      {
        time: '7:15 PM',
        title: 'Final Selection',
      },
    ],
    startAt: `${config.eventYear}-09-28T17:00:00-04:00`,
    endAt: `${config.eventYear}-09-28T19:30:00-04:00`,
    image: require('../assets/event-wine-and-flavours.png'),
  },
  {
    id: 'event-4',
    title: 'Behind the Tables',
    venueId: 'casino',
    date: '10-03',
    time: '7:30 PM–9:30 PM',
    summary:
      'Step behind the casino floor and discover how the tables, games, and dealers work.',
    description: [
      'Behind the Tables offers a guided introduction to the atmosphere and traditions of the casino floor. Guests can meet professional dealers and learn how several classic games are managed.',
      'The experience is educational and interactive, with demonstrations designed for visitors who are new to casino games. Participation does not require gambling.',
    ],
    schedule: [
      {
        time: '7:30 PM',
        title: 'Guest Welcome',
      },
      {
        time: '7:45 PM',
        title: 'Floor Introduction',
      },
      {
        time: '8:15 PM',
        title: 'Dealer Demonstration',
      },
      {
        time: '8:45 PM',
        title: 'Game Rules Overview',
      },
      {
        time: '9:15 PM',
        title: 'Questions and Closing',
      },
    ],
    startAt: `${config.eventYear}-10-03T19:30:00-04:00`,
    endAt: `${config.eventYear}-10-03T21:30:00-04:00`,
    image: require('../assets/event-behind-the-tables.png'),
  },
  {
    id: 'event-5',
    title: 'Dealer’s Masterclass',
    venueId: 'casino',
    date: '10-04',
    time: '6:00 PM–8:30 PM',
    summary:
      'Learn the techniques, etiquette, and precision behind the work of a professional casino dealer.',
    description: [
      'Dealer’s Masterclass gives guests a closer look at the skills required to work at a professional casino table. A casino dealer guides the group through card handling, chip placement, and table etiquette.',
      'The event combines demonstrations with a short practice session. No previous experience is required.',
    ],
    schedule: [
      {
        time: '6:00 PM',
        title: 'Welcome and Introduction',
      },
      {
        time: '6:30 PM',
        title: 'Cards and Chips',
      },
      {
        time: '7:15 PM',
        title: 'Dealing Demonstration',
      },
      {
        time: '7:45 PM',
        title: 'Practice Round',
      },
      {
        time: '8:15 PM',
        title: 'Final Challenge',
      },
    ],
    startAt: `${config.eventYear}-10-04T18:00:00-04:00`,
    endAt: `${config.eventYear}-10-04T20:30:00-04:00`,
    image: require('../assets/event-dealers-masterclass.png'),
  },
  {
    id: 'event-6',
    title: 'Poker Evening',
    venueId: 'casino',
    date: '10-04',
    time: '9:00 PM–12:00 AM',
    summary:
      'Enjoy a relaxed poker evening with guided play, premium refreshments, and a competitive atmosphere.',
    description: [
      'Poker Evening is designed for guests who want to enjoy a social and competitive night at the casino. The programme begins with a short rules overview before moving into guided rounds and the main tournament.',
      'Players can join the experience at their preferred level. Seating is limited and advance registration is recommended.',
    ],
    schedule: [
      {
        time: '9:00 PM',
        title: 'Player Registration',
      },
      {
        time: '9:20 PM',
        title: 'Rules and Table Setup',
      },
      {
        time: '9:45 PM',
        title: 'Opening Round',
      },
      {
        time: '10:45 PM',
        title: 'Main Tournament',
      },
      {
        time: '11:45 PM',
        title: 'Final Table',
      },
    ],
    startAt: `${config.eventYear}-10-04T21:00:00-04:00`,
    endAt: `${config.eventYear}-10-05T00:00:00-04:00`,
    image: require('../assets/event-poker-evening.png'),
  },
  {
    id: 'event-7',
    title: 'Live at the Grand Hall',
    venueId: 'concert',
    date: '10-10',
    time: '8:00 PM–11:00 PM',
    summary:
      'An evening concert featuring live performances in the grand concert hall.',
    description: [
      'Live at the Grand Hall presents an elegant night of music and live entertainment in the main concert venue. Guests can enjoy a carefully selected programme with a mix of opening and headline performances.',
      'The concert hall offers premium seating, atmospheric lighting, and a full-service bar. Guests are encouraged to arrive early to explore the venue.',
    ],
    schedule: [
      {
        time: '8:00 PM',
        title: 'Doors Open',
      },
      {
        time: '8:30 PM',
        title: 'Opening Performance',
      },
      {
        time: '9:15 PM',
        title: 'Main Artist',
      },
      {
        time: '10:15 PM',
        title: 'Special Performance',
      },
      {
        time: '10:45 PM',
        title: 'Closing Set',
      },
    ],
    startAt: `${config.eventYear}-10-10T20:00:00-04:00`,
    endAt: `${config.eventYear}-10-10T23:00:00-04:00`,
    image: require('../assets/event-grand-hall-live.png'),
  },
  {
    id: 'event-8',
    title: 'Midnight Orchestra',
    venueId: 'concert',
    date: '10-11',
    time: '9:30 PM–12:00 AM',
    summary:
      'A late-night orchestral performance combining classical music with a dramatic modern atmosphere.',
    description: [
      'Midnight Orchestra transforms the concert hall into an atmospheric late-night performance space. The programme combines orchestral arrangements, cinematic soundscapes, and carefully designed lighting.',
      'A short intermission allows guests to visit the bar or explore the venue. Formal evening wear is recommended.',
    ],
    schedule: [
      {
        time: '9:30 PM',
        title: 'Doors Open',
      },
      {
        time: '10:00 PM',
        title: 'First Movement',
      },
      {
        time: '10:45 PM',
        title: 'Intermission',
      },
      {
        time: '11:00 PM',
        title: 'Second Movement',
      },
      {
        time: '11:45 PM',
        title: 'Finale',
      },
    ],
    startAt: `${config.eventYear}-10-11T21:30:00-04:00`,
    endAt: `${config.eventYear}-10-12T00:00:00-04:00`,
    image: require('../assets/event-midnight-orchestra.png'),
  },
  {
    id: 'event-9',
    title: 'Jazz Night',
    venueId: 'concert',
    date: '10-17',
    time: '8:30 PM–11:30 PM',
    summary:
      'An intimate jazz performance inspired by the glamour and rhythm of classic casino evenings.',
    description: [
      'Jazz Night brings live jazz, warm lighting, and an elegant lounge atmosphere to the concert hall. Guests can enjoy a curated selection of classic standards and modern arrangements.',
      'The event is ideal for a relaxed evening with cocktails, music, and premium surroundings. Limited lounge seating is available near the stage.',
    ],
    schedule: [
      {
        time: '8:30 PM',
        title: 'Doors Open',
      },
      {
        time: '9:00 PM',
        title: 'Opening Trio',
      },
      {
        time: '9:45 PM',
        title: 'Main Performance',
      },
      {
        time: '10:30 PM',
        title: 'Guest Soloist',
      },
      {
        time: '11:15 PM',
        title: 'Closing Number',
      },
    ],
    startAt: `${config.eventYear}-10-17T20:30:00-04:00`,
    endAt: `${config.eventYear}-10-17T23:30:00-04:00`,
    image: require('../assets/event-casino-jazz-night.png'),
  },
  {
    id: 'event-10',
    title: 'After Dark',
    venueId: 'club',
    date: '10-18',
    time: '10:00 PM–2:00 AM',
    summary:
      'A late-night club experience with live DJs, premium cocktails, and a vibrant atmosphere.',
    description: [
      'After Dark is a high-energy club evening created for guests who want to continue the night with music and dancing. The programme features a progressive DJ lineup and a carefully designed late-night atmosphere.',
      'Premium table reservations and cocktail service are available. Guests must meet the venue’s entry and dress code requirements.',
    ],
    schedule: [
      {
        time: '10:00 PM',
        title: 'Doors Open',
      },
      {
        time: '10:30 PM',
        title: 'Opening DJ Set',
      },
      {
        time: '11:30 PM',
        title: 'Main Performance',
      },
      {
        time: '12:30 AM',
        title: 'Headline Set',
      },
      {
        time: '1:45 AM',
        title: 'Final Track',
      },
    ],
    startAt: `${config.eventYear}-10-18T22:00:00-04:00`,
    endAt: `${config.eventYear}-10-19T02:00:00-04:00`,
    image: require('../assets/event-after-dark.png'),
  },
  {
    id: 'event-11',
    title: 'Red Room Sessions',
    venueId: 'club',
    date: '10-24',
    time: '9:00 PM–1:00 AM',
    summary:
      'An intimate club night with live vocals, atmospheric lighting, and a deep red visual identity.',
    description: [
      'Red Room Sessions combines live music and club energy in a more intimate setting. The evening features live vocals, carefully selected electronic sets, and a deep red visual atmosphere.',
      'The club offers a limited number of premium tables and private seating areas. Advance reservations are recommended.',
    ],
    schedule: [
      {
        time: '9:00 PM',
        title: 'Guest Arrival',
      },
      {
        time: '9:30 PM',
        title: 'Opening Performance',
      },
      {
        time: '10:30 PM',
        title: 'Live Vocal Set',
      },
      {
        time: '11:30 PM',
        title: 'DJ Session',
      },
      {
        time: '12:45 AM',
        title: 'Closing Performance',
      },
    ],
    startAt: `${config.eventYear}-10-24T21:00:00-04:00`,
    endAt: `${config.eventYear}-10-25T01:00:00-04:00`,
    image: require('../assets/event-red-room-sessions.png'),
  },
  {
    id: 'event-12',
    title: 'Late Night Social',
    venueId: 'club',
    date: '10-25',
    time: '10:30 PM–2:30 AM',
    summary:
      'A social late-night event with music, cocktails, and a relaxed premium club atmosphere.',
    description: [
      'Late Night Social is designed for guests who want to connect, enjoy music, and continue their casino evening in a relaxed club environment. The programme combines social spaces, premium drinks, and a rotating DJ lineup.',
      'The atmosphere is less formal and more open, making it suitable for groups and casual evening plans. Club entry and dress code rules apply.',
    ],
    schedule: [
      {
        time: '10:30 PM',
        title: 'Doors Open',
      },
      {
        time: '11:00 PM',
        title: 'Welcome Set',
      },
      {
        time: '11:45 PM',
        title: 'Social Hour',
      },
      {
        time: '12:30 AM',
        title: 'Main DJ Set',
      },
      {
        time: '2:00 AM',
        title: 'Closing Session',
      },
    ],
    startAt: `${config.eventYear}-10-25T22:30:00-04:00`,
    endAt: `${config.eventYear}-10-26T02:30:00-04:00`,
    image: require('../assets/event-late-night-social.png'),
  },
];
