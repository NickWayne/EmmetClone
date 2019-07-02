import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BennettComponent } from './bennett/bennett.component';

const routes: Routes = [
  { path: '', component: BennettComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
