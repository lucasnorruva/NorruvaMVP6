// src/services/shared/cacheManager.ts
/**
 * Cache manager with TTL and pattern-based invalidation
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl: number; // Time to live in milliseconds
}

export class CacheManager {
  private cache: Map<string, CacheItem<any>>;
  private namespace: string;
  
  constructor(namespace: string) {
    this.namespace = namespace;
    this.cache = new Map();
    
    // In a real app, this would be more robust.
    // For this prototype, we will rely on manual cleanup or page reloads.
    // setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
  
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key);
    const item = this.cache.get(fullKey);
    
    if (!item) return null;
    
    if (this.isExpired(key)) {
      this.cache.delete(fullKey);
      return null;
    }
    
    return item.data;
  }
  
  async set<T>(key: string, data: T, options: CacheOptions): Promise<void> {
    const fullKey = this.getFullKey(key);
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl,
    };
    
    this.cache.set(fullKey, item);
  }
  
  async delete(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    this.cache.delete(fullKey);
  }
  
  async clear(): Promise<void> {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${this.namespace}:`)) {
        this.cache.delete(key);
      }
    }
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${this.namespace}:`) && regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
  
  isExpired(key: string): boolean {
    const fullKey = this.getFullKey(key);
    const item = this.cache.get(fullKey);
    
    if (!item) return true;
    
    return Date.now() - item.timestamp > item.ttl;
  }
  
  private getFullKey(key: string): string {
    return `${this.namespace}:${key}`;
  }
  
  private cleanup(): void {
    for (const [key, item] of this.cache.entries()) {
      if (Date.now() - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}
