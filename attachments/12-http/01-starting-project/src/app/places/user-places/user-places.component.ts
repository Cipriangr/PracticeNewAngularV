import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

  service = inject(PlacesService);
  userPlaces = this.service.loadedUserPlaces;
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = this.service.loadUserPlaces().subscribe({
      error: (error: Error) => {
        console.log('!!error', error);
      }
    })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  deletePlace(place: Place) {
    console.log('!!place', place);
    this.service.removeUserPlace(place).subscribe();
  }

}
