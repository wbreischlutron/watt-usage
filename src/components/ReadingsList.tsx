import { createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import { db, EnergyReading } from '../db';

export default function ReadingsList() {
  const [readings, setReadings] = createSignal<EnergyReading[]>([]);
  const [pricePerKwh, setPricePerKwh] = createSignal(0);

  const loadReadings = async () => {
    try {
      const allReadings = await db.readings.orderBy('timestamp').reverse().toArray();
      setReadings(allReadings);
    } catch (error) {
      console.error('Failed to load readings:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await db.settings.toArray();
      if (settings.length > 0) {
        setPricePerKwh(settings[0].pricePerKwh);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
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

  const calculateMonthlyCost = (wattage: number) => {
    // Convert watts to kilowatts, multiply by hours in a day (24), days in month (30), and price per kWh
    const kilowatts = wattage / 1000;
    const monthlyKwh = kilowatts * 24 * 30;
    return monthlyKwh * pricePerKwh();
  };

  const handleReadingsUpdate = () => {
    loadReadings();
  };

  const handleSettingsUpdate = () => {
    loadSettings();
  };

  onMount(() => {
    loadReadings();
    loadSettings();
    window.addEventListener('readings-updated', handleReadingsUpdate);
    window.addEventListener('settings-updated', handleSettingsUpdate);
  });

  onCleanup(() => {
    window.removeEventListener('readings-updated', handleReadingsUpdate);
    window.removeEventListener('settings-updated', handleSettingsUpdate);
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
                <div style={{ display: 'flex', 'flex-direction': 'column', 'align-items': 'flex-end', 'margin-right': '1em' }}>
                  <div class="reading-wattage">{reading.wattage} W</div>
                  <Show when={pricePerKwh() > 0}>
                    <div style={{ 'font-size': '1em', 'font-weight': '600', color: 'var(--color-primary)', 'margin-top': '0.3em' }}>
                      ${calculateMonthlyCost(reading.wattage).toFixed(2)}/month
                    </div>
                  </Show>
                </div>
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
