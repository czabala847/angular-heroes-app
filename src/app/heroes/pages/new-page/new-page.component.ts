import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroService: HeroesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.heroService.getHeroById(id);
        })
      )
      .subscribe((hero) => {
        if (!hero) {
          return this.router.navigateByUrl('/');
        }

        this.heroForm.reset(hero);

        return;
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (!this.heroForm.valid) return;

    if (this.currentHero.id) {
      this.heroService.editHero(this.currentHero).subscribe((hero) => {
        console.log(hero);
        return;
      });
    }

    this.heroService.addHero(this.currentHero).subscribe((hero) => {
      console.log(hero);
    });
  }
}
