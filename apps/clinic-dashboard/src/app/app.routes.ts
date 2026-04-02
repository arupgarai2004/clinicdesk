import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'appointment-list',
    },

    {
        path: 'appointment-list',
        title: 'Appointment List',
        loadComponent: () => import('./features/pages/appointments-list/appointment-list').then(m => m.AppointmentList)
    },

    {
        path: 'appointment-details/:id',
        title: 'Appointment Details',
        loadComponent: () => import('./features/pages/appointment-details/appointment-details').then(m => m.AppointmentDetails)
    },

    {
        path: 'weekly-calendar',
        title: 'Weekly Calendar',
        loadComponent: () => import('./features/pages/weekly-calendar/weekly-calendar').then(m => m.WeeklyCalendar)
    },

    {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./features/pages/settings/settings').then(m => m.Settings)
    }
];
