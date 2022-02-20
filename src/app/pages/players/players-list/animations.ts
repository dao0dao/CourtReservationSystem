import { animate, animateChild, query, sequence, style, transition, trigger } from "@angular/animations";

export const animations = [
    trigger('popUp_container', [
        transition(':enter', [
            style({ opacity: 0 }),
            sequence([
                animate('0.25s ease-in-out', style({ opacity: 1 })),
                query('@card', animateChild())
            ])
        ]),
        transition(':leave', [
            sequence([
                query('@card', animateChild()),
                animate('0.25s ease-in-out', style({ opacity: 0 }))
            ])
        ])
    ]),
    trigger('card', [
        transition(':enter', [
            style({ opacity: 0, transform: 'scale(0.3)' }),
            animate('0.25s ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
        ]),
        transition(':leave', [
            animate('0.25s ease-in-out', style({ opacity: 0, transform: 'scale(0.3)' }))
        ])
    ])
];