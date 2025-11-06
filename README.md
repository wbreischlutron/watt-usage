# Watt Usage Tracker

An offline-first web application to track energy consumption from your appliances and calculate electricity costs.

## Features

- **Add Energy Readings**: Record wattage readings for each outlet/appliance with location names
- **Real-time Calculations**: Automatically calculates cumulative wattage across all readings
- **Cost Estimates**: Input your electricity rate ($/kWh) to see hourly, daily, monthly, and yearly cost projections
- **Offline-First**: All data is stored locally in your browser using IndexedDB (via Dexie)
- **Clean UI**: Themed with soft blue and yellow colors, appropriate for electricity tracking

## Technology Stack

- **Solid.js**: Reactive UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Dexie**: IndexedDB wrapper for offline data storage

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Add a Reading**: Enter the location/name of your outlet (e.g., "Living Room TV") and the current wattage reading from your wattage reader.

2. **Set Your Rate**: In the Settings section, input your electricity cost per kWh (check your utility bill).

3. **View Statistics**: The app shows:
   - Total current wattage across all outlets
   - Number of active outlets
   - Cost projections (per hour, day, month, year)

4. **Manage Readings**: Delete readings you no longer need. All changes are saved automatically to your browser's local storage.

## Data Storage

All data is stored locally in your browser using IndexedDB. This means:
- The app works completely offline
- Your data never leaves your device
- Data persists between sessions
- Clearing browser data will delete your readings

## Learn More

- [Solid.js Documentation](https://solidjs.com)
- [Vite Documentation](https://vite.dev)
- [Dexie Documentation](https://dexie.org)

## License

MIT
