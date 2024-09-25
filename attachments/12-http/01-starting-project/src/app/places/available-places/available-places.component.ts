import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef)

  ngOnInit(): void {
    this.isFetching.set(true);
    this.getPlaces();
  }

  getPlaces(): void {
    // return this.httpClient.get<Place[]>('http://localhost:3000/places').pipe(
    //   tap((response: Place[]) => {
    //     console.log('!!response', response);
    //     this.places.set(response);
    //   }),
    //   catchError((err) => {
    //     console.log('@!#', err);
    //     return throwError(() => new Error('Error fetching places'));
    //   })
    // )
    const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')
    .pipe(
      map((values) => values.places),
      catchError((error) => {
        console.log('!!error', error);
        return throwError(() => {
          new Error('Error from backend');
        });
      })
    )
    .subscribe({
      next: (response) => {
        this.places.set(response);
        console.log('!!res', response);
      },
      error: (error) => {
        console.log('!!error', error);
        this.error.set(error.statusText)
      },
      complete: () => {
        this.isFetching.set(false);
      }
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(selectedPlace: Place) {
    this.httpClient.put('http://localhost:3000/user-places', {
      placeId: selectedPlace.id,
    }).subscribe({
      next: (value) => {
        console.log('!!value', value);
      }
    });
  }
}
