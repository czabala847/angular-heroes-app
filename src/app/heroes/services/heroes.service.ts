import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BDResponse, Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private jsonUrl = 'assets/data/db.json';

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<BDResponse>(this.jsonUrl)
      .pipe(map((data) => data.heroes));
  }
}
