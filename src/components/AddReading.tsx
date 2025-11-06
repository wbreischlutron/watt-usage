import { createSignal } from 'solid-js';
import { db } from '../db';

export default function AddReading() {
  const [location, setLocation] = createSignal('');
  const [wattage, setWattage] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const wattageValue = parseFloat(wattage());
    const locationValue = location().trim();

    if (!locationValue || isNaN(wattageValue) || wattageValue <= 0) {
      alert('Please enter a valid location and wattage');
      return;
    }

    try {
      await db.readings.add({
        location: locationValue,
        wattage: wattageValue,
        timestamp: new Date()
      });

      // Reset form
      setLocation('');
      setWattage('');

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('readings-updated'));
    } catch (error) {
      console.error('Failed to add reading:', error);
      alert('Failed to add reading. Please try again.');
    }
  };

  return (
    <div class="card">
      <h2>Add New Reading</h2>
      <form onSubmit={handleSubmit}>
        <div class="form-group">
          <label for="location">Location / Outlet Name</label>
          <input
            id="location"
            type="text"
            placeholder="e.g., Living Room TV, Kitchen Refrigerator"
            value={location()}
            onInput={(e) => setLocation(e.currentTarget.value)}
            required
          />
        </div>

        <div class="form-group">
          <label for="wattage">Current Wattage (W)</label>
          <input
            id="wattage"
            type="number"
            step="0.1"
            min="0"
            placeholder="e.g., 150"
            value={wattage()}
            onInput={(e) => setWattage(e.currentTarget.value)}
            required
          />
        </div>

        <button type="submit">Add Reading</button>
      </form>
    </div>
  );
}
