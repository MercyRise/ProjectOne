import { useEffect, useState } from 'react';
import { useItineraryStore } from '../store/itineraryStore';

const mockFetchDestinations = () =>
  new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve([
        'Amsterdam, Netherlands',
        'Cape Town, South Africa',
        'Hanoi, Vietnam',
        'Lisbon, Portugal',
        'New York City, USA'
      ]);
    }, 400);
  });

const DestinationSelector = () => {
  const {
    destination,
    availableDestinations,
    setDestination,
    setAvailableDestinations
  } = useItineraryStore((state) => ({
    destination: state.destination,
    availableDestinations: state.availableDestinations,
    setDestination: state.setDestination,
    setAvailableDestinations: state.setAvailableDestinations
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (availableDestinations.length > 0) {
      return;
    }

    setLoading(true);
    mockFetchDestinations()
      .then((destinations) => {
        setAvailableDestinations(destinations);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load destinations.');
      })
      .finally(() => setLoading(false));
  }, [availableDestinations.length, setAvailableDestinations]);

  return (
    <div>
      <div className="form-control">
        <label htmlFor="destination">Select a city</label>
        <select
          id="destination"
          value={destination ?? ''}
          onChange={(event) => setDestination(event.target.value)}
        >
          <option value="" disabled>
            Choose a destination
          </option>
          {availableDestinations.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Loading destinations…</p>}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default DestinationSelector;
