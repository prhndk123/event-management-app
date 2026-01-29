import { create } from 'zustand';
import { Event, EventCategory } from '~/types';
import { mockEvents } from '~/data/mock-data';

interface EventFilters {
  category: EventCategory | 'all';
  location: string | 'all';
  search: string;
  priceRange: 'all' | 'free' | 'paid';
}

interface EventState {
  events: Event[];
  filters: EventFilters;
  isLoading: boolean;
  
  // Actions
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, data: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  resetFilters: () => void;
  getFilteredEvents: () => Event[];
  getEventById: (id: string) => Event | undefined;
  setLoading: (loading: boolean) => void;
}

const defaultFilters: EventFilters = {
  category: 'all',
  location: 'all',
  search: '',
  priceRange: 'all',
};

export const useEventStore = create<EventState>((set, get) => ({
  events: mockEvents,
  filters: defaultFilters,
  isLoading: false,

  setEvents: (events) => {
    set({ events });
  },

  addEvent: (event) => {
    set((state) => ({
      events: [event, ...state.events]
    }));
  },

  updateEvent: (eventId, data) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId ? { ...event, ...data } : event
      )
    }));
  },

  deleteEvent: (eventId) => {
    set((state) => ({
      events: state.events.filter(event => event.id !== eventId)
    }));
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  getFilteredEvents: () => {
    const { events, filters } = get();
    
    return events.filter(event => {
      // Only show published events
      if (event.status !== 'published') return false;
      
      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }
      
      // Location filter
      if (filters.location !== 'all' && event.location !== filters.location) {
        return false;
      }
      
      // Price range filter
      if (filters.priceRange === 'free' && event.price > 0) return false;
      if (filters.priceRange === 'paid' && event.price === 0) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(searchLower);
        const matchesDescription = event.description.toLowerCase().includes(searchLower);
        const matchesLocation = event.location.toLowerCase().includes(searchLower);
        const matchesVenue = event.venue.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesLocation && !matchesVenue) {
          return false;
        }
      }
      
      return true;
    });
  },

  getEventById: (id) => {
    return get().events.find(event => event.id === id);
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
