import { Routes } from '@angular/router';
import { LogginComponent } from './loggin/loggin.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LogginComponent,
    },
    {
        path: 'main/:param',
        component: MainComponent,
        canActivate: [authGuard]
    },
    {
        path: 'main',
        component: MainComponent,
        canActivate: [authGuard]
    },
    /*
    {
        path: 'invalid', //componente para la posterior redirección si la cuenta es inválida o no existe, implementar luego la redirección al cabo de unos segundos
        
    },
    */
];
