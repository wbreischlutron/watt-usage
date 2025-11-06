import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { db, EnergyReading } from '../db';

export default function ReadingsList() {
  const [readings, setReadings] = createSignal<EnergyReading[]>([]);

  const loadReadings = async () => {
    try {
      const allReadings = await db.readings.orderBy('timestamp').reverse().toArray();
      setReadings(allReadings);
    } catch (error) {
      console.error('Failed to load readings:', error);
    }
  };

  const deleteReading = async (id: number | undefined) => {
    if (!id) return;

    if (confirm('Are you sure you want to delete this reading?')) {
      try {
        await db.readings.delete(id);
        await loadReadings();
        window.dispatchEvent(new CustomEvent('readings-updated'));
      } catch (error) {
        console.error('Failed to delete reading:', error);
        alert('Failed to delete reading. Please try again.');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReadingsUpdate = () => {
    loadReadings();
  };

  onMount(() => {
    loadReadings();
    window.addEventListener('readings-updated', handleReadingsUpdate);
  });

  onCleanup(() => {
    window.removeEventListener('readings-updated', handleReadingsUpdate);
  });

  return (
    <div class="card">
      <h2>All Readings ({readings().length})</h2>

      {readings().length === 0 ? (
        <p style={{ color: 'var(--color-text-light)', 'text-align': 'center', padding: '2em' }}>
          No readings yet. Add your first reading above!
        </p>
      ) : (
        <div>
          <For each={readings()}>
            {(reading) => (
              <div class="reading-item">
                <div class="reading-info">
                  <div class="reading-location">{reading.location}</div>
                  <div class="reading-details">
                    {formatDate(reading.timestamp)}
                  </div>
                </div>
                <div class="reading-wattage">{reading.wattage} W</div>
                <button
                  class="danger delete-btn"
                  onClick={() => deleteReading(reading.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  );
}
