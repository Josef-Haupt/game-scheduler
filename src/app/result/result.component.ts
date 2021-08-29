import { Component, OnInit } from '@angular/core';
import { makeLightColor } from '../color-utils';
import { GameService, MatchResult } from '../game.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  results: MatchResult[];
  playerResults: number[];
  stats: Stat[];

  constructor(public gameService: GameService) {
    this.results = gameService.results;
    this.stats = [];

    this.playerResults = new Array(this.gameService.persons.length).fill(0);

    this.calcResults();
  }

  public color(index: number | string) {
    return makeLightColor(typeof index === "number" ? index : this.gameService.persons.indexOf(index));
  }

  private calcResults() {
    const stats: StatCol[] = [];

    for (let i = 0; i < this.gameService.persons.length; i++) {
      stats.push({
        gameCount: 0,
        scores: [],
        winCount: 0
      })
    }

    for (const result of this.results) {
      for (const p of result.team1) {
        const index = this.gameService.persons.indexOf(p);
        stats[index].gameCount += 1;
        stats[index].scores.push(result.scoreTeam1);

        if (result.scoreTeam1 > result.scoreTeam2) {
          this.playerResults[index] += 1;
          stats[index].winCount += 1;
        }
      }

      for (const p of result.team2) {
        const index = this.gameService.persons.indexOf(p);
        stats[index].gameCount += 1;
        stats[index].scores.push(result.scoreTeam2);

        if (result.scoreTeam2 > result.scoreTeam1) {
          this.playerResults[index] += 1;
          stats[index].winCount += 1;
        }
      }
    }
    this.stats = stats.map(col => {
      return {
        winRate: (col.winCount / col.gameCount * 100).toFixed(1) + ' %',
        meanScore: (col.scores.reduce((x, y) => x + y) / col.gameCount).toFixed(1)
      }
    });
  }

  ngOnInit(): void {
  }

}

interface StatCol {
  gameCount: number;
  winCount: number;
  scores: number[];
}

interface Stat {
  winRate: string,
  meanScore: string;
}
