import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  save(key: string, obj: any) {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  read<T>(key: string): T | null {
    var json = localStorage.getItem(key);

    if (json) {
      return JSON.parse(json) as T;
    }

    return null;
  }
}
