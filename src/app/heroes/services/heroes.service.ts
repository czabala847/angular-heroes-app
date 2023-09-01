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

  getData(): Observable<BDResponse> {
    return this.http.get<BDResponse>(this.jsonUrl);
  }

  getHeroes(): Observable<Hero[]> {
    return this.getData().pipe(map((data) => data.heroes));
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.getHeroes().pipe(
      map((heroes) => {
        return heroes.find((hero) => hero.id === id);
      })
    );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.getHeroes().pipe(
      map((heroes) => {
        return heroes
          .filter((hero) =>
            hero.superhero.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5);
      })
    );
  }
}
