import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AboutComponent} from './about/about.component';
import {PokertimerComponent} from './pokertimer/pokertimer.component';

const routes: Routes = [
    {
        path: '',
        component: AboutComponent
    },
    {
        path: 'pokertimer',
        component: PokertimerComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
