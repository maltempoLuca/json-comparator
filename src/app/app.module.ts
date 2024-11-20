import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // For two-way data binding
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Angular Material
import { MatSelectModule } from '@angular/material/select'; // Material Dropdown
import { MatButtonModule } from '@angular/material/button';
import {AppComponent} from './app.component'; // Material Button


@NgModule({
  declarations: [AppComponent], // Declare your main AppComponent
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent], // Bootstrap the main AppComponent
})
export class AppModule {}
