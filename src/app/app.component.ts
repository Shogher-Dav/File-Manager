import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'File-Manager';

  public currentPathEvent: Event;

  childCurrentPathEvent(event: Event) {
    this.currentPathEvent = event;
  }
}
