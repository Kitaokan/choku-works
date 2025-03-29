/**
 * A simple in-memory storage system for Glowbie images.
 * In a production environment, this would be replaced with actual cloud storage.
 */

import { v4 as uuidv4 } from 'uuid';

interface GlowbieEntry {
  id: string;
  imageData: string;
  createdAt: number;
  expiresAt: number;
}

class GlowbieStorage {
  private static instance: GlowbieStorage;
  private storage: Map<string, GlowbieEntry> = new Map();
  
  // Retention period in milliseconds (2 weeks)
  private readonly RETENTION_PERIOD = 14 * 24 * 60 * 60 * 1000;

  private constructor() {
    // Initialize and start the cleanup interval
    setInterval(() => this.cleanupExpiredEntries(), 60 * 60 * 1000); // Check every hour
  }

  public static getInstance(): GlowbieStorage {
    if (!GlowbieStorage.instance) {
      GlowbieStorage.instance = new GlowbieStorage();
    }
    return GlowbieStorage.instance;
  }

  /**
   * Store a new Glowbie image
   * @param imageData Base64 encoded image data
   * @returns The ID of the stored image
   */
  public storeImage(imageData: string): string {
    const now = Date.now();
    const id = uuidv4();
    
    const entry: GlowbieEntry = {
      id,
      imageData,
      createdAt: now,
      expiresAt: now + this.RETENTION_PERIOD
    };
    
    this.storage.set(id, entry);
    return id;
  }

  /**
   * Retrieve a Glowbie image by ID
   * @param id The ID of the image to retrieve
   * @returns The image entry or null if not found
   */
  public getImage(id: string): GlowbieEntry | null {
    const entry = this.storage.get(id);
    return entry || null;
  }

  /**
   * Clean up expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    
    // Map.entriesをArray.fromで配列に変換してからforEachで処理
    Array.from(this.storage).forEach(([id, entry]) => {
      if (entry.expiresAt < now) {
        this.storage.delete(id);
        console.log(`Deleted expired Glowbie: ${id}`);
      }
    });
  }
}

export default GlowbieStorage;