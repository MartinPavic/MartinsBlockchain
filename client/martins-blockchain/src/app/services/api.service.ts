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
  public awards$ = new Subject<RectorAward>();

  constructor(private httpClient: HttpClient) {}

  public createNewPoints(numOfPoints: number): Observable<number> {
    return this.httpClient.post<number>(this.API_URL + '/points', { numOfPoints }).pipe(first());
  }

  public getPointsSupply(): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + '/points');
  }

  public getAwardsSupply(): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + '/awards');
  }

  public createNewAward(id: string): Observable<RectorAward> {
    return this.httpClient.post<RectorAward>(this.API_URL + '/awards', { id });
  }

  public assignAwardToStudent(awardId: string, studentId: string): Observable<string> {
    return this.httpClient.put<string>(this.API_URL + `/awards/${studentId}`, { awardId });
  }

  public getCurrentOrganization(): void {
    this.httpClient.get<Organization>(this.API_URL + '/organization').pipe(first()).subscribe(this.organization$);
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/users');
  }
}
