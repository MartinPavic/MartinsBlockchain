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
  awards: RectorAward[];
  numOfPoints: number;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPointsSupply().pipe(first()).subscribe(res => this.totalSupply = res);
    this.users$ = this.apiService.getUsers();
    this.apiService.getAwards().pipe(first()).subscribe(res => this.awards = res);
    this.apiService.awards$.subscribe(newAward => this.awards.concat(newAward))
  }

  createAward() {
    const id = Math.floor(Math.random() * 100).toString();
    this.apiService.createNewAward(id).subscribe(newAward => this.apiService.awards$.next([newAward]));
  }

  addPoints() {
    this.apiService
      .createNewPoints(this.numOfPoints)
      .pipe(first())
      .subscribe((res: number) => {
        this.totalSupply += res;
        this.organization = { ...this.organization, balance: this.organization.balance + this.numOfPoints };
        this.apiService.organization$.next(this.organization);
        this.numOfPoints = null;
      });
  } 

  assignPointsToStudent(userAndPoints: any) {
    this.organization = { ...this.organization, balance: this.organization.balance - userAndPoints.points }
    this.apiService.organization$.next(this.organization)
  }

  assignAwardToStudent(award: RectorAward, student: User) {
    this.apiService.assignAwardToStudent(award.tokenId.toString(), student.id)
    .subscribe(res => {
      if (res) {
        const index = this.awards.findIndex(a => a === award);
        const newAward = { ...award, holder: student.id }
        this.awards = [
          ...this.awards.slice(0, index),
          newAward,
          ...this.awards.slice(index + 1),
        ];
        this.apiService.awards$.next(this.awards);
      }
    })
  }

}
