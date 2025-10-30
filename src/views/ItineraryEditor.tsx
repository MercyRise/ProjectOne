import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ItineraryDay, useItineraryStore } from '../store/itineraryStore';

interface DraftItem {
  placeName: string;
  address: string;
  price: string;
  notes: string;
}

const createEmptyDraft = (): DraftItem => ({
  placeName: '',
  address: '',
  price: '',
  notes: ''
});

const ItineraryEditor = () => {
  const {
    days,
    addDay,
    renameDay,
    removeDay,
    addItemToDay,
    updateItem,
    removeItem
  } = useItineraryStore((state) => ({
    days: state.days,
    addDay: state.addDay,
    renameDay: state.renameDay,
    removeDay: state.removeDay,
    addItemToDay: state.addItemToDay,
    updateItem: state.updateItem,
    removeItem: state.removeItem
  }));
  const [drafts, setDrafts] = useState<Record<string, DraftItem>>({});
  const [draftErrors, setDraftErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setDrafts((prev) => {
      const nextDrafts: Record<string, DraftItem> = {};
      days.forEach((day) => {
        nextDrafts[day.id] = prev[day.id] ?? createEmptyDraft();
      });
      return nextDrafts;
    });
    setDraftErrors((prev) => {
      const nextErrors: Record<string, string | null> = {};
      days.forEach((day) => {
        nextErrors[day.id] = prev[day.id] ?? null;
      });
      return nextErrors;
    });
  }, [days]);

  const totalCost = useMemo(() => {
    return days.reduce((sum, day) => {
      const dayTotal = day.items.reduce((daySum, item) => daySum + (item.price ?? 0), 0);
      return sum + dayTotal;
    }, 0);
  }, [days]);

  const handleDraftChange = (dayId: string, field: keyof DraftItem, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value
      }
    }));
  };

  const validateDraft = (draft: DraftItem) => {
    if (!draft.placeName.trim()) {
      return 'Place name is required.';
    }

    if (draft.price.trim()) {
      const parsed = Number(draft.price);
      if (Number.isNaN(parsed) || parsed < 0) {
        return 'Price must be a non-negative number.';
      }
    }

    return null;
  };

  const handleAddItem = (day: ItineraryDay, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const draft = drafts[day.id] ?? createEmptyDraft();
    const error = validateDraft(draft);

    if (error) {
      setDraftErrors((prev) => ({ ...prev, [day.id]: error }));
      return;
    }

    setDraftErrors((prev) => ({ ...prev, [day.id]: null }));

    addItemToDay(day.id, {
      placeName: draft.placeName.trim(),
      address: draft.address.trim(),
      price: draft.price ? Number(draft.price) : null,
      notes: draft.notes.trim()
    });

    setDrafts((prev) => ({
      ...prev,
      [day.id]: createEmptyDraft()
    }));
  };

  const handleExistingItemChange = (
    dayId: string,
    itemId: string,
    field: 'placeName' | 'address' | 'price' | 'notes',
    value: string
  ) => {
    if (field === 'price') {
      if (value === '') {
        updateItem(dayId, itemId, { price: null });
        return;
      }

      const parsed = Number(value);
      if (Number.isNaN(parsed) || parsed < 0) {
        return;
      }

      updateItem(dayId, itemId, { price: parsed });
      return;
    }

    const trimmed = field === 'notes' ? value : value.trimStart();
    updateItem(dayId, itemId, { [field]: trimmed });
  };

  return (
    <div>
      <button type="button" onClick={() => addDay()}>
        Add Day
      </button>
      {days.length === 0 && <p>Add your first day to start planning your itinerary.</p>}
      {days.map((day) => (
        <div key={day.id} className="itinerary-day">
          <div className="form-control">
            <label htmlFor={`day-title-${day.id}`}>Day title</label>
            <input
              id={`day-title-${day.id}`}
              value={day.title}
              onChange={(event) => renameDay(day.id, event.target.value)}
              placeholder="e.g. Arrival & City Walk"
            />
          </div>
          <div className="itinerary-items">
            {day.items.map((item) => {
              const placeError = !item.placeName.trim();
              return (
                <div key={item.id} className="itinerary-item">
                  <div className="form-control">
                    <label htmlFor={`item-place-${item.id}`}>Place name</label>
                    <input
                      id={`item-place-${item.id}`}
                      value={item.placeName}
                      onChange={(event) =>
                        handleExistingItemChange(day.id, item.id, 'placeName', event.target.value)
                      }
                      required
                    />
                    {placeError && <span className="error-text">Place name is required.</span>}
                  </div>
                  <div className="form-control">
                    <label htmlFor={`item-address-${item.id}`}>Address</label>
                    <input
                      id={`item-address-${item.id}`}
                      value={item.address}
                      onChange={(event) =>
                        handleExistingItemChange(day.id, item.id, 'address', event.target.value)
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor={`item-price-${item.id}`}>Price</label>
                    <input
                      id={`item-price-${item.id}`}
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.price ?? ''}
                      onChange={(event) =>
                        handleExistingItemChange(day.id, item.id, 'price', event.target.value)
                      }
                    />
                  </div>
                  <div className="form-control">
                    <label htmlFor={`item-notes-${item.id}`}>Notes</label>
                    <textarea
                      id={`item-notes-${item.id}`}
                      rows={2}
                      value={item.notes}
                      onChange={(event) =>
                        handleExistingItemChange(day.id, item.id, 'notes', event.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="destructive"
                    onClick={() => removeItem(day.id, item.id)}
                  >
                    Remove Item
                  </button>
                </div>
              );
            })}
          </div>
          <form onSubmit={(event) => handleAddItem(day, event)}>
            <h4>Add itinerary item</h4>
            <div className="form-control">
              <label htmlFor={`new-place-${day.id}`}>Place name</label>
              <input
                id={`new-place-${day.id}`}
                value={drafts[day.id]?.placeName ?? ''}
                onChange={(event) =>
                  handleDraftChange(day.id, 'placeName', event.target.value)
                }
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor={`new-address-${day.id}`}>Address</label>
              <input
                id={`new-address-${day.id}`}
                value={drafts[day.id]?.address ?? ''}
                onChange={(event) => handleDraftChange(day.id, 'address', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor={`new-price-${day.id}`}>Price</label>
              <input
                id={`new-price-${day.id}`}
                type="number"
                min={0}
                step={0.01}
                value={drafts[day.id]?.price ?? ''}
                onChange={(event) => handleDraftChange(day.id, 'price', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor={`new-notes-${day.id}`}>Notes</label>
              <textarea
                id={`new-notes-${day.id}`}
                rows={2}
                value={drafts[day.id]?.notes ?? ''}
                onChange={(event) => handleDraftChange(day.id, 'notes', event.target.value)}
              />
            </div>
            {draftErrors[day.id] && <p className="error-text">{draftErrors[day.id]}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit">Add Item</button>
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setDrafts((prev) => ({ ...prev, [day.id]: createEmptyDraft() }))
                }
              >
                Clear
              </button>
              <button type="button" className="destructive" onClick={() => removeDay(day.id)}>
                Remove Day
              </button>
            </div>
          </form>
        </div>
      ))}
      {days.length > 0 && (
        <p>
          Estimated total cost: <strong>${totalCost.toFixed(2)}</strong>
        </p>
      )}
    </div>
  );
};

export default ItineraryEditor;
