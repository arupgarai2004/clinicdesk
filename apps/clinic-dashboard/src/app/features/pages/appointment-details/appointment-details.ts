import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointment-details',
  imports: [RouterLink],
  templateUrl: './appointment-details.html',
  styleUrl: './appointment-details.scss',
})
export class AppointmentDetails {
  private readonly route = inject(ActivatedRoute);

  readonly appointmentId = this.route.snapshot.paramMap.get('id');
}
