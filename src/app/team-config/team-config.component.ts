import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { makeLightColor } from '../color-utils';
import { GameService } from '../game.service';

@Component({
  selector: 'app-team-config',
  templateUrl: './team-config.component.html',
  styleUrls: ['./team-config.component.scss']
})
export class TeamConfigComponent implements OnInit {
  persons: any[];
  teamsize;
  minGames;

  constructor(
    private snackbar: MatSnackBar,
    private gameService: GameService,
    private router: Router
  ) {
    this.teamsize = this.gameService.teamSize ? this.gameService.teamSize : 3;
    this.minGames = this.gameService.minGames ? this.gameService.minGames : 8;
    this.persons = this.gameService.persons && this.gameService.persons.length ? this.gameService.persons : [
      // 'robert',
      // 'nick',
      // 'peter',
      // 'ludwig',
      // 'christian',
      // 'lisa',
      // 'max',
      // 'sandra',
      // 'tina'
    ];
  }

  removeAt(index: number) {
    this.persons.splice(index, 1);
  }

  addPerson(input: HTMLInputElement) {
    if (!input.value.trim()) {
      this.snackbar.open("Name darf nicht leer sein!");
      return;
    }

    this.persons.push(input.value.trim());
    input.value = "";
  }

  color(index: number) {
    return makeLightColor(index);
  }

  onKey(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key == "Enter") {
      this.addPerson(input);
    }
  }

  calcTeams() {
    if (!this.teamsize) {
      this.snackbar.open("Teamsize darf nicht leer oder 0 sein!");
      return;
    }

    if (!this.minGames) {
      this.snackbar.open("Minimale Spiele dürfen nicht 0 oder kleiner sein!");
      return;
    }

    if (this.teamsize * 2 > this.persons.length) {
      this.snackbar.open("Es sollten mindestens zwei Teams erstellbar sein!");
      return;
    }


    this.gameService.setGameConfig(this.persons, this.teamsize, this.minGames);
    this.router.navigate(['/plan']);
  }

  ngOnInit(): void {
  }
}
