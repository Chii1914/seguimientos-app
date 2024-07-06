import { Routes } from '@angular/router';
import { LogginComponent } from './loggin/loggin.component';
import { MainComponent } from './main/main.component';
import { authGuard } from './guard/auth.guard';
import { StudentComponent } from './student/student.component';
import { StudentTableComponent } from './student-table/student-table.component';

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
        canActivate: [authGuard],
    }, 
    {
        path: 'student',
        component: StudentComponent,
        canActivate: [authGuard]
    },
    {
        path: 'studentAll',
        component: StudentTableComponent,
        canActivate: [authGuard]
    }
    /*
{
path: 'invalid', //componente para la posterior redirección si la cuenta es inválida o no existe, implementar luego la redirección al cabo de unos segundos
 
},
*/
];
