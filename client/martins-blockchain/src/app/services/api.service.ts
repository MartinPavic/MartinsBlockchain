import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, map, shareReplay } from 'rxjs/operators';
import { RectorAward } from '../models/rectorAward';
import { User } from '../models/user';
import { Organization } from '../models/organization';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private API_URL = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) {}

  public createNewPoints(numOfPoints: number): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + '/points', { numOfPoints }).pipe(first());
  }

  public getPointsSupply(): Observable<string> {
    return this.httpClient.get<string[]>(this.API_URL + '/points').pipe(map(value => value[0]));
  }

  public getAwardsSupply(): Observable<number> {
    return this.httpClient.get<number>(this.API_URL + '/awards');
  }

  public createNewAward(id: string): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + '/awards', { id });
  }

  public assignAwardToStudent(awardId: string, studentId: string): Observable<string> {
    return this.httpClient.put<string>(this.API_URL + `/awards/${studentId}`, { awardId });
  }

  public getCurrentOrganization(): Observable<Organization> {
    return this.httpClient.get<Organization>(this.API_URL + '/organization').pipe(shareReplay());
  }

  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.API_URL + '/users');
  }
}
