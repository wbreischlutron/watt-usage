import { createSignal, onMount } from 'solid-js';
import { db } from '../db';

export default function Settings() {
  const [pricePerKwh, setPricePerKwh] = createSignal('');
  const [currentPrice, setCurrentPrice] = createSignal(0);

  const loadSettings = async () => {
    try {
      const settings = await db.settings.toArray();
      if (settings.length > 0) {
        setCurrentPrice(settings[0].pricePerKwh);
        setPricePerKwh(settings[0].pricePerKwh.toString());
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const price = parseFloat(pricePerKwh());

    if (isNaN(price) || price < 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      // Clear existing settings and add new one
      await db.settings.clear();
      await db.settings.add({ pricePerKwh: price });

      setCurrentPrice(price);
      window.dispatchEvent(new CustomEvent('settings-updated'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  onMount(() => {
    loadSettings();
  });

  return (
    <div class="card">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="price">Electricity Price ($ per kWh)</label>
          <input
            id="price"
            type="number"
            step="0.0001"
            min="0"
            placeholder="e.g., 0.12"
            value={pricePerKwh()}
            onInput={(e) => setPricePerKwh(e.currentTarget.value)}
            required
          />
          <p style={{ 'margin-top': '0.5em', 'font-size': '0.9em', color: 'var(--color-text-light)' }}>
            Check your electricity bill for the rate per kilowatt-hour (kWh)
          </p>
        </div>

        <button type="submit" class="secondary">Save Settings</button>
      </form>

      {currentPrice() > 0 && (
        <div style={{ 'margin-top': '1em', padding: '1em', 'background-color': 'var(--color-bg)', 'border-radius': '8px' }}>
          <strong>Current Rate:</strong> ${currentPrice().toFixed(4)} per kWh
        </div>
      )}
    </div>
  );
}
