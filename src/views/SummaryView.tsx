import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '../store/itineraryStore';

const SummaryView = () => {
  const navigate = useNavigate();
  const { destination, departureDate, returnDate, days, reset } = useItineraryStore((state) => ({
    destination: state.destination,
    departureDate: state.departureDate,
    returnDate: state.returnDate,
    days: state.days,
    reset: state.reset
  }));

  const totalCost = days.reduce((sum, day) => {
    return sum + day.items.reduce((itemSum, item) => itemSum + (item.price ?? 0), 0);
  }, 0);

  return (
    <div className="summary-card">
      <h2>Trip Summary</h2>
      {!destination && days.length === 0 && (
        <p>Your itinerary is empty. Start planning from the Plan Trip tab.</p>
      )}
      {destination && (
        <div className="summary-section">
          <h3>Destination</h3>
          <p>{destination}</p>
        </div>
      )}
      {(departureDate || returnDate) && (
        <div className="summary-section">
          <h3>Travel Dates</h3>
          <p>
            {departureDate ? new Date(departureDate).toLocaleDateString() : 'TBD'} –{' '}
            {returnDate ? new Date(returnDate).toLocaleDateString() : 'TBD'}
          </p>
        </div>
      )}
      {days.length > 0 && (
        <div className="summary-section">
          <h3>Itinerary</h3>
          {days.map((day) => (
            <div key={day.id} className="summary-day">
              <h4>{day.title}</h4>
              {day.items.length === 0 ? (
                <p>No items added yet.</p>
              ) : (
                <ul>
                  {day.items.map((item) => (
                    <li key={item.id}>
                      <strong>{item.placeName}</strong>
                      {item.address && <span> – {item.address}</span>}
                      {typeof item.price === 'number' && (
                        <span>
                          {' '}
                          · ${item.price.toFixed(2)}
                        </span>
                      )}
                      {item.notes && <p>{item.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <p>
            Total estimated cost: <strong>${totalCost.toFixed(2)}</strong>
          </p>
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" className="secondary" onClick={() => navigate('/')}>
          Back to planner
        </button>
        <button type="button" className="destructive" onClick={reset}>
          Clear itinerary
        </button>
      </div>
    </div>
  );
};

export default SummaryView;
