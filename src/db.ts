import Dexie, { Table } from 'dexie';

export interface EnergyReading {
  id?: number;
  location: string;
  wattage: number;
  timestamp: Date;
}

export interface Settings {
  id?: number;
  pricePerKwh: number;
}

export class WattUsageDB extends Dexie {
  readings!: Table<EnergyReading>;
  settings!: Table<Settings>;

  constructor() {
    super('WattUsageDB');
    this.version(1).stores({
      readings: '++id, location, wattage, timestamp',
      settings: '++id'
    });
  }
}

export const db = new WattUsageDB();
