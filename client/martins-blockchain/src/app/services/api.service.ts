import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { RectorAward } from '../models/rectorAward';
import { User } from '../models/user';
import { Organization } from '../models/organization';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:8000';
  public organization$ = new Subject<Organization>();
  public awards$ = new Subject<RectorAward[]>();

  constructor(private httpClient: HttpClient) {}

  public createNewPoints(numOfPoints: number): Observable<number> {
    return this.httpClient.post<number>(this.API_URL + '/points', { numOfPoints }).pipe(first(), map(res => Number(res)));
  }

  public getPointsSupply(): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + '/points').pipe(map(res => Number(res)));
  }

  public getAwards(): Observable<RectorAward[]> {
    return this.httpClient.get<RectorAward[]>(this.API_URL + '/awards').pipe(map(awards => awards.map(award => { return { ...award, holder: award.holder ? this.extractUserId(award.holder) : 'Admin'}})));
  }

  public createNewAward(id: string): Observable<RectorAward> {
    return this.httpClient.post<RectorAward>(this.API_URL + '/awards', { id }).pipe(map(award => { return { ...award, holder: award.holder ? this.extractUserId(award.holder) : 'Admin'}}));
  }
  private extractUserId = (value: string) => {
    const split = value.split('::')[1].split("/");
    return split[2].slice(3);
  };

  public assignAwardToStudent(awardId: string, studentId: string): Observable<boolean> {
    return this.httpClient.put<boolean>(this.API_URL + `/awards/${studentId}`, { awardId });
  }

  public getCurrentOrganization(): void {
    this.httpClient.get<Organization>(this.API_URL + '/organization').pipe(first(), map(org => {return { ...org, balance: Number(org.balance) } })).subscribe(this.organization$);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/users');
  }

  public assignPointsToStudent(student: User, numOfPoints: number): Observable<boolean> {
    return this.httpClient.put<boolean>(this.API_URL + '/points/' + student.id, { numOfPoints })
  }
}
