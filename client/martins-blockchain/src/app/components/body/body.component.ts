import { Component, Input, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { RectorAward } from 'src/app/models/rectorAward';
import { ApiService } from '../../services/api.service';
import { Organization } from '../../models/organization';
import { User } from 'src/app/models/user';
import { reduce } from 'rxjs/operators';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  users$: Observable<User[]>;
  @Input() organization$: Observable<Organization>;
  totalSupply$: Observable<string>;
  totalSupplySubject$ = new ReplaySubject();
  awardsTotalSupply$: Observable<number>;

  award: RectorAward;
  numOfPoints: number;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.totalSupply$ = this.apiService.getPointsSupply();
    this.users$ = this.apiService.getUsers();
    this.awardsTotalSupply$ = this.apiService.getAwardsSupply();
  }

  createAward() {
    const id = Math.floor(Math.random() * 100).toString();
    this.apiService.createNewAward(id).subscribe(res => this.award = { holder: null, id });
  }

  addPoints() {
    this.apiService.createNewPoints(this.numOfPoints).subscribe(res => this.totalSupplySubject$.next(this.numOfPoints));
  }

}
