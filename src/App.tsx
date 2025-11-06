import AddReading from './components/AddReading';
import ReadingsList from './components/ReadingsList';
import Summary from './components/Summary';
import Settings from './components/Settings';

function App() {
  return (
    <div>
      <header style={{ 'margin-bottom': '2em' }}>
        <h1>⚡ Watt Usage Tracker</h1>
        <p style={{ color: 'var(--color-text-light)', 'font-size': '1.1em' }}>
          Monitor your appliance energy consumption and costs
        </p>
      </header>

      <Summary />

      <AddReading />

      <ReadingsList />

      <Settings />

      <footer style={{ 'margin-top': '3em', 'text-align': 'center', color: 'var(--color-text-light)', 'font-size': '0.9em' }}>
        <p>Offline-first • Data stored locally in your browser</p>
      </footer>
    </div>
  );
}

export default App;
