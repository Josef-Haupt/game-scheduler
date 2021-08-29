import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePlanComponent } from './game-plan/game-plan.component';
import { ResultComponent } from './result/result.component';
import { TeamConfigComponent } from './team-config/team-config.component';

const routes: Routes = [
  {
    path: '',
    component: TeamConfigComponent
  },
  {
    path: "plan",
    component: GamePlanComponent
  },
  {
    path: "results",
    component: ResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
