'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarDays, Users2, HandHeart, MapPin, LayoutGrid, List } from 'lucide-react';
import { StatCard } from '@/components/dashboard-shell';

const events = [
    {
        title: 'Sunday Mass',
        date: 'Sep 7, 2026 · 9:00 AM',
        location: 'Main Sanctuary',
        attendees: 210,
        start: '2026-09-07T09:00:00',
        end: '2026-09-07T10:30:00',
    },
    {
        title: 'Parish Council Meeting',
        date: 'Sep 9, 2026 · 7:00 PM',
        location: 'Fellowship Hall',
        attendees: 12,
        start: '2026-09-09T19:00:00',
        end: '2026-09-09T20:30:00',
    },
    {
        title: 'Youth Group Retreat',
        date: 'Sep 13, 2026 · All day',
        location: 'Camp Grace',
        attendees: 34,
        start: '2026-09-13',
        end: '2026-09-15',
        allDay: true,
    },
    {
        title: 'Fall Food Drive',
        date: 'Sep 20, 2026 · 10:00 AM',
        location: 'Parish Parking Lot',
        attendees: 48,
        start: '2026-09-20T10:00:00',
        end: '2026-09-20T13:00:00',
    },
    {
        title: 'Choir Rehearsal',
        date: 'Sep 23, 2026 · 6:30 PM',
        location: 'Music Room',
        attendees: 18,
        start: '2026-09-23T18:30:00',
        end: '2026-09-23T20:00:00',
    },
    {
        title: 'Community Potluck',
        date: 'Sep 27, 2026 · 12:00 PM',
        location: 'Fellowship Hall',
        attendees: 96,
        start: '2026-09-27T12:00:00',
        end: '2026-09-27T14:00:00',
    },
];

const calendarEvents = events.map((e) => ({
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay ?? false,
}));

type ViewMode = 'calendar' | 'list';

export function EventsView() {
    const [view, setView] = useState<ViewMode>('calendar');

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-primary">Events</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Calendar</h1>
                    <p className="mt-2 text-muted-foreground">Plan services, gatherings, and community moments with your team.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex rounded-xl border bg-card p-1">
                        <button
                            onClick={() => setView('calendar')}
                            className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid className="size-4" />
                            Calendar
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List className="size-4" />
                            List
                        </button>
                    </div>
                    <button className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Create event</button>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard label="Upcoming events" value="6" note="Next 30 days" icon={CalendarDays} />
                <StatCard label="RSVPs this month" value="418" note="Across all events" icon={Users2} />
                <StatCard label="Volunteers needed" value="9" note="Open sign-up slots" icon={HandHeart} />
            </div>

            {view === 'calendar' ? (
                <div className="mt-6 rounded-2xl border bg-card p-4 md:p-6">
                    <div className="fc-parishbooks">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate="2026-09-01"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                            }}
                            height="auto"
                            events={calendarEvents}
                            dayMaxEventRows={3}
                            nowIndicator
                        />
                    </div>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {events.map((e) => (
                        <div key={e.title} className="rounded-2xl border bg-card p-5">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <CalendarDays className="size-5" />
                            </div>
                            <h3 className="mt-4 font-semibold">{e.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{e.date}</p>
                            <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="size-4" />
                                {e.location}
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Users2 className="size-4" />
                                {e.attendees} attending
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
