import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';

import { BDResponse, Hero, Publisher } from '../interfaces/hero.interface';

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

  addHero(hero: Hero): Observable<Hero> {
    const idPublisher = hero.publisher === Publisher.DCComics ? 'dc' : 'marvel';
    const newHero: Hero = {
      ...hero,
      id: `${hero.superhero.toLowerCase()}-${idPublisher}-${new Date().getTime()}`,
    };

    return this.getData().pipe(
      map((data) => {
        const newHeroes = [...data.heroes, newHero];
        return { ...data, heroes: newHeroes };
      }),
      switchMap((updateData) => {
        this.http.put(this.jsonUrl, updateData);

        return of(newHero);
      })
    );
  }

  editHero(hero: Hero): Observable<Hero> {
    return this.getData().pipe(
      map((data) => {
        const newHeroes = data.heroes.map((h) => (h.id === hero.id ? hero : h));
        return { ...data, heroes: newHeroes };
      }),
      switchMap((updateData) => {
        this.http.put(this.jsonUrl, updateData);

        return of(hero);
      })
    );
  }
}
