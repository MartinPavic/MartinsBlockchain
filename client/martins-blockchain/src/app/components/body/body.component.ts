import { Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { RectorAward } from 'src/app/models/rectorAward';
import { ApiService } from '../../services/api.service';
import { Organization } from '../../models/organization';
import { User } from 'src/app/models/user';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  users$: Observable<User[]>;
  @Input() organization: Organization;
  totalSupply: number;
  awards$: Observable<RectorAward[]>;
  numOfPoints: number;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPointsSupply().pipe(first()).subscribe(res => this.totalSupply = res);
    this.users$ = this.apiService.getUsers();
  }

  createAward() {
    const id = Math.floor(Math.random() * 100).toString();
    this.apiService.createNewAward(id).subscribe(newAward => this.apiService.awards$.next(newAward));
  }

  addPoints() {
    this.apiService
      .createNewPoints(this.numOfPoints)
      .pipe(first())
      .subscribe(res => {
        this.totalSupply += res;
        this.apiService.organization$.next({ ...this.organization, balance: this.organization.balance + this.numOfPoints })
      });
  }  

}
