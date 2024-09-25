import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  destroyRef = inject(DestroyRef);

  constructor(private http: HttpClient) {

  }

  loadAvailablePlaces() {}

  loadUserPlaces() {
    this.http.get('http://localhost:3000/user-places');
  }

  addPlaceToUserPlaces(place: Place) {}

  removeUserPlace(place: Place) {}
}
