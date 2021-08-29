import { Injectable } from '@angular/core';
import { uniqueCombinations } from './combinations';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private _persons: string[];
  private _teamsize: number;
  private _uniqueTeams: string[][];
  private _results: MatchResult[];

  public minGames: number;

  public get persons(): string[] {
    return [...this._persons];
  }

  public get teamSize(): number {
    return this._teamsize;
  }

  public get results(): MatchResult[] {
    return this._results;
  }

  public get uniqueTeams(): string[][] {
    const result = [];

    for (const team of this._uniqueTeams) {
      result.push([...team]);
    }

    return result;
  }

  constructor(private localStrorageService: LocalStorageService) {
    this._persons = localStrorageService.read("persons") ?? [];
    this._teamsize = localStrorageService.read("teamSize") ?? 0;
    this._uniqueTeams = localStrorageService.read("uniqueTeams") ?? [];
    this.minGames = localStrorageService.read("minGames") ?? 0;
    this._results = localStrorageService.read("results") ?? [];
  }

  public setGameConfig(persons: string[], teamsize: number, minGames: number) {
    this._persons = persons;
    this._teamsize = teamsize;
    this.minGames = minGames;
    this._uniqueTeams = [...uniqueCombinations(persons, teamsize)] //.sort((x: string[], y: string[]) => x.toString().localeCompare(y.toString()));

    this.localStrorageService.save("persons", this._persons);
    this.localStrorageService.save("teamSize", this._teamsize);
    this.localStrorageService.save("minGames", this.minGames);
    this.localStrorageService.save("uniqueTeams", this._uniqueTeams);
  }

  public saveResults(results: MatchResult[]) {
    this._results = results;
    this.localStrorageService.save("results", results);
  }

}

export interface MatchResult {
  team1: string[],
  team2: string[],
  scoreTeam1: number,
  scoreTeam2: number,
}
