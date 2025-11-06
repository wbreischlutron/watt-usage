import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { db, EnergyReading, Settings } from '../db';

export default function Summary() {
  const [totalWattage, setTotalWattage] = createSignal(0);
  const [pricePerKwh, setPricePerKwh] = createSignal(0);
  const [readingsCount, setReadingsCount] = createSignal(0);

  const loadSummary = async () => {
    try {
      // Get all readings
      const readings = await db.readings.toArray();
      const total = readings.reduce((sum, reading) => sum + reading.wattage, 0);
      setTotalWattage(total);
      setReadingsCount(readings.length);

      // Get price per kWh from settings
      const settings = await db.settings.toArray();
      if (settings.length > 0) {
        setPricePerKwh(settings[0].pricePerKwh);
      }
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  };

  const handleUpdate = () => {
    loadSummary();
  };

  onMount(() => {
    loadSummary();
    window.addEventListener('readings-updated', handleUpdate);
    window.addEventListener('settings-updated', handleUpdate);
  });

  onCleanup(() => {
    window.removeEventListener('readings-updated', handleUpdate);
    window.removeEventListener('settings-updated', handleUpdate);
  });

  // Convert total watts to kilowatts
  const totalKilowatts = () => totalWattage() / 1000;

  // Calculate hourly cost (assuming all devices are running continuously)
  const hourlyCost = () => totalKilowatts() * pricePerKwh();

  // Calculate daily cost (24 hours)
  const dailyCost = () => hourlyCost() * 24;

  // Calculate monthly cost (30 days)
  const monthlyCost = () => dailyCost() * 30;

  // Calculate yearly cost (365 days)
  const yearlyCost = () => dailyCost() * 365;

  return (
    <div>
      <div class="grid">
        <div class="stat">
          <div class="stat-value">{totalWattage().toFixed(1)} W</div>
          <div class="stat-label">Total Current Usage</div>
        </div>

        <div class="stat">
          <div class="stat-value">{totalKilowatts().toFixed(2)} kW</div>
          <div class="stat-label">Total in Kilowatts</div>
        </div>

        <div class="stat">
          <div class="stat-value">{readingsCount()}</div>
          <div class="stat-label">Active Outlets</div>
        </div>
      </div>

      <Show when={pricePerKwh() > 0}>
        <div class="card">
          <h2>Cost Estimates</h2>
          <p style={{ color: 'var(--color-text-light)', 'margin-bottom': '1.5em', 'font-size': '0.95em' }}>
            Based on ${pricePerKwh().toFixed(4)}/kWh (assuming continuous operation)
          </p>

          <div class="grid">
            <div class="stat highlight">
              <div class="stat-value">${hourlyCost().toFixed(3)}</div>
              <div class="stat-label">Per Hour</div>
            </div>

            <div class="stat highlight">
              <div class="stat-value">${dailyCost().toFixed(2)}</div>
              <div class="stat-label">Per Day</div>
            </div>

            <div class="stat highlight">
              <div class="stat-value">${monthlyCost().toFixed(2)}</div>
              <div class="stat-label">Per Month</div>
            </div>

            <div class="stat highlight">
              <div class="stat-value">${yearlyCost().toFixed(2)}</div>
              <div class="stat-label">Per Year</div>
            </div>
          </div>
        </div>
      </Show>

      <Show when={pricePerKwh() === 0 && readingsCount() > 0}>
        <div class="card" style={{ 'text-align': 'center', padding: '2em' }}>
          <p style={{ color: 'var(--color-text-light)' }}>
            Set your electricity price in the Settings section below to see cost estimates.
          </p>
        </div>
      </Show>
    </div>
  );
}
