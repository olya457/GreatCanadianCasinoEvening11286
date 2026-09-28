import { VenueId } from '../types';
import { assets } from './assets';

export const venues = [
  {
    id: 'restaurant' as VenueId,
    name: 'Restaurant',
    label: 'RESTAURANT',
    symbol: 'dining',
    image: assets.restaurant,
    x: 18,
    y: 13,
    description:
      'A refined dining space offering chef-led dinners, cocktail masterclasses, wine tastings, and seasonal culinary experiences. Elegant interiors, attentive service, and a relaxed atmosphere for premium evening events.',
    hours: '6:00 PM–1:00 AM daily',
    features: 'Chef-led dining · Wine tastings · Cocktails',
    directions:
      'From the main entrance, follow the central walkway to the fountain. Take the gold path on the left and continue to the restaurant entrance.',
  },
  {
    id: 'casino' as VenueId,
    name: 'Gaming Hall',
    label: 'GAMING HALL',
    symbol: 'spade',
    image: assets.casino,
    x: 81,
    y: 13,
    description:
      'The heart of the complex, featuring gaming tables, professional dealers, guided tours, and interactive casino experiences. Explore the traditions of casino entertainment in a sophisticated and welcoming environment.',
    hours: 'See event times; contact the venue for daily hours.',
    features: 'Gaming tables · Guided tours · Professional dealers',
    directions:
      'From the main entrance, follow the central walkway to the fountain. Take the red path on the right and continue to the casino entrance.',
  },
  {
    id: 'concert' as VenueId,
    name: 'Concert Hall',
    label: 'EVENT HALL',
    symbol: 'music',
    image: assets.concert,
    x: 16,
    y: 53,
    description:
      'A grand performance venue for live concerts, orchestral programmes, jazz nights, and special evening shows. Premium seating, dramatic lighting, and carefully curated performances.',
    hours: 'Doors open at the time listed for each event.',
    features: 'Live performances · Premium seating · Full-service bar',
    directions:
      'Enter through the main entrance and continue straight to the central fountain. Turn left onto the blue path to reach the concert hall.',
  },
  {
    id: 'club' as VenueId,
    name: 'Club',
    label: 'CLUB',
    symbol: 'music',
    image: assets.club,
    x: 84,
    y: 53,
    description:
      'A stylish late-night venue with live DJs, vocal performances, premium cocktails, and atmospheric lighting. From relaxed social evenings to high-energy midnight events.',
    hours: 'Opening times follow the event programme.',
    features: 'Live DJs · Premium cocktails · Private seating',
    directions:
      'Enter through the main entrance and continue straight to the central fountain. Turn right onto the purple path to reach the club.',
  },
];
export function getVenue(id: VenueId) {
  return venues.find(venue => venue.id === id)!;
}
