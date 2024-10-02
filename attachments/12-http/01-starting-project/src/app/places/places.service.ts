import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();
  destroyRef = inject(DestroyRef);

  constructor(private http: HttpClient) {

  }

  loadAvailablePlaces() {
    return this.fetchplaces('http://localhost:3000/places', 'no places');
  }

  loadUserPlaces() {
    return this.fetchplaces('http://localhost:3000/user-places', 'no user places').pipe(
      tap({
        next: (userplaces) => {
          this.userPlaces.set(userplaces);
        }
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prevPlaces = this.userPlaces();

    if(!prevPlaces.some((value) => value.id === place.id)) {
      this.userPlaces.set([...prevPlaces, place])
    }

    return this.http.put('http://localhost:3000/user-places', {
      placeId: place.id
    }).pipe(
      catchError(error => {
        this.userPlaces.set(prevPlaces);
        // console.log(error);
        return throwError(() => new Error(error));
      })
    )
  }

  removeUserPlace(place: Place) {
    const existingPlaces = this.userPlaces();

    if(existingPlaces.some((values) => values.id === place.id)) {
      // console.log('!!userPLACES', this.userPlaces());
      // const getIndex = existingPlaces.findIndex(value => value.id === place.id);
      // console.log('!!getIndex', getIndex);
      this.userPlaces.set(existingPlaces.filter(value => value.id !== place.id));
      // this.userPlaces().splice(getIndex, 1);
      // console.log('!!userPLACES2', this.userPlaces());
    }

    return this.http.delete(`http://localhost:3000/user-places/${place.id}`).pipe(
      tap(value => console.log('!@14325', value)),
      catchError((error) => {
        this.userPlaces.set(existingPlaces);
        return throwError(() => {
          new Error(error);
        })
      })
    )
  }

  private fetchplaces(url: string, errorMessage: string) {
    return this.http.get<{places: Place[]}>(url)
    .pipe(
      map((values) => values.places),
      catchError((error) => {
        console.log('!!error', error);
        return throwError(() => {
          new Error(errorMessage);
        });
      })
    )
  }
}
