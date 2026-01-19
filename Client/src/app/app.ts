import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckInDialogComponent } from './components/check-in-dialog/check-in-dialog.component';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(CheckInDialogComponent) checkInDialog!: CheckInDialogComponent;
  protected readonly title = signal('Client');

  openCheckInDialog(): void {
    this.checkInDialog?.open();
  }
}
