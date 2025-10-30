import { useState } from 'react';
import { useItineraryStore } from '../store/itineraryStore';

const TravelDatesForm = () => {
  const { departureDate, returnDate, setDates } = useItineraryStore((state) => ({
    departureDate: state.departureDate,
    returnDate: state.returnDate,
    setDates: state.setDates
  }));
  const [error, setError] = useState<string | null>(null);

  const handleDepartureChange = (value: string) => {
    const departing = value || null;
    const returning = returnDate;

    if (departing && returning && departing > returning) {
      setError('Departure date must be before return date.');
      return;
    }

    setError(null);
    setDates(departing, returning);
  };

  const handleReturnChange = (value: string) => {
    const departing = departureDate;
    const returning = value || null;

    if (departing && returning && returning < departing) {
      setError('Return date must be after departure date.');
      return;
    }

    setError(null);
    setDates(departing, returning);
  };

  return (
    <form className="date-form">
      <div className="form-control">
        <label htmlFor="departure-date">Departure</label>
        <input
          id="departure-date"
          type="date"
          value={departureDate ?? ''}
          onChange={(event) => handleDepartureChange(event.target.value)}
        />
      </div>
      <div className="form-control">
        <label htmlFor="return-date">Return</label>
        <input
          id="return-date"
          type="date"
          min={departureDate ?? undefined}
          value={returnDate ?? ''}
          onChange={(event) => handleReturnChange(event.target.value)}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default TravelDatesForm;
