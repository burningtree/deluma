
import { Ticket, Calendar, Sparkles, PlusCircle, Document, 
    ArrowLeftStartOnRectangle, ArrowRightEndOnRectangle, Cog6Tooth, Key } from 'svelte-heros-v2';

export function searchItemsBase () {
    return [
        {
            id: 'events',
            type: 'general',
            name: 'Events',
            handle: 'events',
            baseUrl: '/events',
            icon: Ticket,
        },
        {
            id: 'calendars',
            type: 'general',
            name: 'Calendars',
            baseUrl: '/calendars',
            icon: Calendar,
        },
        {
            id: 'explore',
            type: 'general',
            name: 'Explore',
            baseUrl: '/',
            icon: Sparkles,
        },
        {
            id: 'create-calendar',
            type: 'general',
            name: 'Create Calendar',
            baseUrl: '/create-calendar',
            icon: PlusCircle,
            description: 'Create a new Calendar',
            keywords: 'cc c c',
        },
        {
            id: 'create-event',
            type: 'general',
            name: 'Create Event',
            baseUrl: '/create',
            icon: PlusCircle,
            description: 'Create a new Event',
            keywords: 'ce c e create create',
        },
        {
            id: 'documentation',
            type: 'general',
            name: 'Documentation',
            baseUrl: 'https://docs.evermeet.app',
            icon: Document,
            description: 'Read documentation of Evermeet',
            keywords: 'docs',
        },
        {
            id: 'logout',
            type: 'general',
            name: 'Sign out',
            baseUrl: '/logout',
            icon: ArrowLeftStartOnRectangle,
            description: 'Logout from current session',
            keywords: 'lo so logout signout exit',
        },
        {
            id: 'login',
            type: 'general',
            name: 'Sign in',
            baseUrl: '/login',
            icon: ArrowRightEndOnRectangle,
            description: 'Login to current instance',
            keywords: 'li si sign in log in',
        },
        {
            id: 'settings',
            type: 'general',
            name: 'Settings',
            baseUrl: '/me/settings',
            icon: Cog6Tooth,
            description: 'User settings and preferences',
            keywords: '',
        },
        {
            id: 'settings-account',
            type: 'general',
            name: 'Settings → Account',
            baseUrl: '/me/settings/account',
            icon: Cog6Tooth,
            description: 'User account & profile settings',
            keywords: 'profile password',
        },
        {
            id: 'action-change-password',
            type: 'general',
            name: 'Change Password',
            baseUrl: '/me/settings/account#password',
            icon: Key,
            description: 'Change password',
            keywords: 'password',
        },
        {
            id: 'action-update-profile',
            type: 'general',
            name: 'Update profile',
            baseUrl: '/me/settings/account#profile',
            icon: Cog6Tooth,
            description: 'Update public profile or avatar',
            keywords: 'image avatar display name description change',
        },
        {
            id: 'settings-preferences',
            type: 'general',
            name: 'Settings → Preferences',
            baseUrl: '/me/settings/preferences',
            icon: Cog6Tooth,
            description: 'User preference',
            keywords: 'timezone tz',
        },
        {
            id: 'settings-security',
            type: 'general',
            name: 'Settings → Security',
            baseUrl: '/me/settings/security',
            icon: Cog6Tooth,
            description: 'User security options',
            keywords: '',
        },
    ];
}