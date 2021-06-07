import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from './models/organization';
import { ApiService } from './services/api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'martins-blockchain';
  organization$: Observable<Organization>

  constructor(public apiService: ApiService) {
    this.organization$ = this.apiService.getCurrentOrganization();
  }

}
