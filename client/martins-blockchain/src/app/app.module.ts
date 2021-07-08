import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListPointsComponent } from './components/list-points/list-points.component';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './material.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandlerService } from './services/error-handler.service';
import { BodyComponent } from './components/body/body.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './components/user-card/user-card.component';
import { OwnerPipe } from './pipes/owner.pipe';
@NgModule({
  declarations: [
    AppComponent,
    ListPointsComponent,
    HeaderComponent,
    BodyComponent,
    UserCardComponent,
    OwnerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MaterialModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: ErrorHandlerService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
