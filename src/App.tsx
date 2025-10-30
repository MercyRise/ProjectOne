import { NavLink, Route, Routes } from 'react-router-dom';
import DestinationSelector from './components/DestinationSelector';
import TravelDatesForm from './components/TravelDatesForm';
import ItineraryEditor from './views/ItineraryEditor';
import SummaryView from './views/SummaryView';
import { useItineraryStore } from './store/itineraryStore';

const App = () => {
  const hasItinerary = useItineraryStore((state) => state.days.length > 0);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Travel Planner</h1>
        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Plan Trip
          </NavLink>
          <NavLink
            to="/summary"
            className={({ isActive }) => {
              const classes = [] as string[];
              if (isActive) {
                classes.push('active');
              }
              if (!hasItinerary) {
                classes.push('disabled');
              }
              return classes.join(' ') || undefined;
            }}
            aria-disabled={!hasItinerary}
            tabIndex={!hasItinerary ? -1 : undefined}
          >
            Summary
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="planner">
                <section className="panel">
                  <h2>Destination</h2>
                  <DestinationSelector />
                </section>
                <section className="panel">
                  <h2>Travel Dates</h2>
                  <TravelDatesForm />
                </section>
                <section className="panel">
                  <h2>Itinerary</h2>
                  <ItineraryEditor />
                </section>
              </div>
            }
          />
          <Route path="/summary" element={<SummaryView />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
