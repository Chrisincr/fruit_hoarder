import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
  { path: 'register',component: RegisterComponent },
  { path: 'login',component: LoginComponent },
  { path: 'play', component: PlayComponent },
  { path: 'scoreboard', component: ScoreboardComponent },
  { path: 'edit', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
