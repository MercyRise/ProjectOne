import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NullableDateString = string | null;

export interface ItineraryItem {
  id: string;
  placeName: string;
  address: string;
  price: number | null;
  notes: string;
}

export interface ItineraryDay {
  id: string;
  title: string;
  items: ItineraryItem[];
}

export interface ItineraryState {
  destination: string | null;
  availableDestinations: string[];
  departureDate: NullableDateString;
  returnDate: NullableDateString;
  days: ItineraryDay[];
  setDestination: (destination: string) => void;
  setAvailableDestinations: (destinations: string[]) => void;
  setDates: (departure: NullableDateString, returning: NullableDateString) => void;
  addDay: (title?: string) => void;
  renameDay: (dayId: string, title: string) => void;
  removeDay: (dayId: string) => void;
  addItemToDay: (dayId: string, item: Omit<ItineraryItem, 'id'>) => void;
  updateItem: (dayId: string, itemId: string, item: Partial<Omit<ItineraryItem, 'id'>>) => void;
  removeItem: (dayId: string, itemId: string) => void;
  reset: () => void;
}

const generateId = () => Math.random().toString(36).slice(2, 9);

const defaultDestinations = [
  'Barcelona, Spain',
  'Kyoto, Japan',
  'Lisbon, Portugal',
  'Sydney, Australia',
  'Vancouver, Canada'
];

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set) => ({
      destination: null,
      availableDestinations: defaultDestinations,
      departureDate: null,
      returnDate: null,
      days: [],
      setDestination: (destination) => set({ destination }),
      setAvailableDestinations: (destinations) => set({ availableDestinations: destinations }),
      setDates: (departure, returning) => set({ departureDate: departure, returnDate: returning }),
      addDay: (title) =>
        set((state) => ({
          days: [
            ...state.days,
            {
              id: generateId(),
              title: title ?? `Day ${state.days.length + 1}`,
              items: []
            }
          ]
        })),
      renameDay: (dayId, title) =>
        set((state) => ({
          days: state.days.map((day) => (day.id === dayId ? { ...day, title } : day))
        })),
      removeDay: (dayId) =>
        set((state) => ({
          days: state.days.filter((day) => day.id !== dayId)
        })),
      addItemToDay: (dayId, item) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  items: [
                    ...day.items,
                    {
                      id: generateId(),
                      placeName: item.placeName,
                      address: item.address,
                      price: item.price,
                      notes: item.notes
                    }
                  ]
                }
              : day
          )
        })),
      updateItem: (dayId, itemId, item) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  items: day.items.map((existing) =>
                    existing.id === itemId ? { ...existing, ...item } : existing
                  )
                }
              : day
          )
        })),
      removeItem: (dayId, itemId) =>
        set((state) => ({
          days: state.days.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  items: day.items.filter((existing) => existing.id !== itemId)
                }
              : day
          )
        })),
      reset: () =>
        set({
          destination: null,
          departureDate: null,
          returnDate: null,
          days: []
        })
    }),
    {
      name: 'travel-itinerary-store'
    }
  )
);
