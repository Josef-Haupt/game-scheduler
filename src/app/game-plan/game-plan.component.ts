import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { makeLightColor } from '../color-utils';
import { unique, uniqueCombinations } from '../combinations';
import { GameService, MatchResult } from '../game.service';
import { nCr } from '../math-utils';

declare type Matrix = { [person: string]: { [otherPerson: string]: number } };

@Component({
  selector: 'app-game-plan',
  templateUrl: './game-plan.component.html',
  styleUrls: ['./game-plan.component.scss']
})
export class GamePlanComponent implements OnInit {
  matches: [string[], string[]][] = [];
  playerMatches: [string, number][] = [];
  teams: string[][] = [];
  matchresults: [string, string][] = [];

  constructor(public readonly gameService: GameService, private router: Router) {
    this.calcMatches();
  }

  ngOnInit(): void {
  }

  color(person: string) {
    return makeLightColor(this.gameService.persons.indexOf(person));
  }

  private initMatrix(matrix: Matrix) {
    for (const person of this.gameService.persons) {
      const row: { [key: string]: number } = {};
      matrix[person] = row;

      for (const otherPerson of this.gameService.persons) {
        if (person === otherPerson) continue;

        row[otherPerson] = 0;
      }
    }
  }

  private calcMatches() {
    const uniqueTeams = [...this.gameService.uniqueTeams];
    const matches: any[] = [];
    const playedMatches: any[] = [];
    let currentTeam: string[];
    const playedwithMatrix: Matrix = {};
    const playedagainstMatrix: Matrix = {};
    const inTeamPos = nCr(this.gameService.teamSize, 2);
    const againstPos = this.gameService.teamSize ** 2;
    const withFactor = 1 - inTeamPos / (inTeamPos + againstPos);
    const againstFactor =  1 - againstPos / (inTeamPos + againstPos);

    this.initMatrix(playedagainstMatrix);
    this.initMatrix(playedwithMatrix);

    // Berechnung aller möglichen Matchups
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
      // matches.sort(this.sortByPlayedMatchesDesc(playedMatches));
      matches.sort(this.sortBySeenScore(playedwithMatrix, playedagainstMatrix, withFactor, againstFactor));

      if (matches && matches.length) {
        const match = matches.pop();
        playedMatches.push(match);

        for (const [p1, p2] of uniqueCombinations(match[0], 2)) {
          playedwithMatrix[p1][p2]++;
          playedwithMatrix[p2][p1]++;
        }

        for (const [p1, p2] of uniqueCombinations(match[1], 2)) {
          playedwithMatrix[p1][p2]++;
          playedwithMatrix[p2][p1]++;
        }

        for (const person of match[0]) {
          for (const otherPerson of match[1]) {
            playedagainstMatrix[person][otherPerson]++;
            playedagainstMatrix[otherPerson][person]++;
          }
        }
      }
      else break;
    }

    this.matches = playedMatches;
    this.matchresults = [];
    this.playerMatches = [...this.countMatchesPerPerson(playedMatches).entries()];

    const teams = [];

    for (const [team1, team2] of playedMatches) {
      teams.push(team1, team2);
    }

    this.teams = unique(teams);
    this.teams.sort((t1, t2) => t1.toString().localeCompare(t2.toString()));

    console.log(playedagainstMatrix);
    console.log(playedwithMatrix);

    this.matchresults = [];

    this.matches.forEach(_ => this.matchresults.push(["", ""]));

    /* -------- DEBUG ------- */

    const matchUps: {[key: string]: number} = {}

    for (const [team1, team2] of this.matches) {
      if (team1.toString() in matchUps) {
        matchUps[team1.toString()]++;
      }
      else {
        matchUps[team1.toString()] = 1;
      }

      if (team2.toString() in matchUps) {
        matchUps[team2.toString()]++;
      }
      else {
        matchUps[team2.toString()] = 1;
      }
    }

    console.log(matchUps);
  }

  public calcResult() {
    const results: MatchResult[] = [];

    for (let i = 0; i < this.matchresults.length; i++) {
      const element = this.matchresults[i];

      if (element[0] !== "" && element[0] !== undefined && element[0] !== null && element[1] !== "" && element[1] !== undefined && element[1] !== null) {
        results.push({
          scoreTeam1: Number.parseInt(element[0]),
          scoreTeam2: Number.parseInt(element[1]),
          team1: this.matches[i][0],
          team2: this.matches[i][1]
        })
      }
    }

    this.gameService.saveResults(results);
    this.router.navigate(["/results"]);
  }

  private sortBySeenScore(withM: Matrix, againstM: Matrix, withFactor: number, againstFactor: number) {
    return (m1: [string[], string[]], m2: [string[], string[]]) => {
      return this.calcSeenScore(m2, withM, againstM, withFactor, againstFactor) - this.calcSeenScore(m1, withM, againstM, withFactor, againstFactor);
    }
  }

  private calcSeenScore(match: [string[], string[]], withM: Matrix, againstM: Matrix, withFactor: number, againstFactor: number) {
    let withScore = 0;
    let againstScore = 0;

    for (const [p1, p2] of uniqueCombinations(match[0], 2)) {
      withScore += withM[p1][p2];
    }

    for (const [p1, p2] of uniqueCombinations(match[1], 2)) {
      withScore += withM[p1][p2];
    }

    for (const person of match[0]) {
      for (const otherPerson of match[1]) {
        againstScore += againstM[person][otherPerson];
      }
    }

    return withScore * withFactor + againstScore * againstFactor;
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
