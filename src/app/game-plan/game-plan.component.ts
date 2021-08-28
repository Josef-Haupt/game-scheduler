import { Component, OnInit } from '@angular/core';
import { makeLightColor } from '../color-utils';
import { unique } from '../combinations';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game-plan',
  templateUrl: './game-plan.component.html',
  styleUrls: ['./game-plan.component.scss']
})
export class GamePlanComponent implements OnInit {
  matches: string[][] = [];
  playerMatches: [string, number][] = [];
  teams: string[][] = [];

  constructor(public readonly gameService: GameService) {
    this.calcMatches();
  }

  ngOnInit(): void {
  }

  color(person: string) {
    return makeLightColor(this.gameService.persons.indexOf(person));
  }

  private calcMatches() {
    const uniqueTeams = [...this.gameService.uniqueTeams];
    const matches: any[] = [];
    const playedMatches: any[] = [];
    let currentTeam: string[];

    while (currentTeam = uniqueTeams.pop()!) {
      teamLoop:
      for (const enemyTeam of uniqueTeams) {
        for (const currentTeamPerson of currentTeam) {
          if (enemyTeam.indexOf(currentTeamPerson) >= 0) {
            continue teamLoop;
          }
        }

        matches.push([currentTeam, enemyTeam]);
      }
    }

    while ([...this.countMatchesPerPerson(playedMatches).values()].some(count => count < this.gameService.minGames)) {
      matches.sort(this.sortByPlayedMatchesDesc(playedMatches));

      if (matches && matches.length) {
        playedMatches.push(matches.pop());
      }
      else break;
    }

    this.matches = playedMatches;
    this.playerMatches = [...this.countMatchesPerPerson(playedMatches).entries()];

    const teams = [];

    for (const [team1, team2] of playedMatches) {
      teams.push(team1, team2);
    }

    this.teams = unique(teams);
    this.teams.sort((t1, t2) => t1.toString().localeCompare(t2.toString()));
  }

  private sortByPlayedMatchesDesc(playedMatches: [string[], string[]][]) {
    const matchCounts = this.countMatchesPerPerson(playedMatches);

    return (match1: [string[], string[]], match2: [string[], string[]]) => {
      let matchCount1 = 0;
      let matchCount2 = 0;

      for (const player of match1[0]) {
        matchCount1 += matchCounts.get(player);
      }
      for (const player of match1[1]) {
        matchCount1 += matchCounts.get(player);
      }

      for (const player of match2[0]) {
        matchCount2 += matchCounts.get(player);
      }
      for (const player of match2[1]) {
        matchCount2 += matchCounts.get(player);
      }

      return matchCount2 - matchCount1;
    };
  }

  private countMatchesPerPerson(matches: [string[], string[]][]) {
    const map = new Map;

    for (const person of this.gameService.persons) {
      map.set(person, 0);
    }

    for (const [team1, team2] of matches) {
      for (const person of team1) {
        map.set(person, map.get(person)! + 1);
      }
      for (const person of team2) {
        map.set(person, map.get(person)! + 1);
      }
    }

    return map;
  }
}
