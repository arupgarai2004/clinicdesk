import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@org/ui-layout';

@Component({
  imports: [RouterModule,Header,Footer],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'clinic-dashboard';
}
