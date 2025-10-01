'use client';

import { Calendar } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  attendees: number;
  host: string;
}

interface EventsListProps {
  events: Event[];
}

export const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{event.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{event.date} • {event.time}</span>
                <span>{event.attendees} attending</span>
              </div>
            </div>
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-400">Hosted by {event.host}</span>
            <button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-105 transition-transform">
              Join Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};