import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event, formatCurrency, formatDate } from '~/types';
import { Badge } from '~/components/ui/badge';

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const isFree = event.price === 0;
  const soldOut = event.availableSeats === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="group block card-elevated overflow-hidden"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 overlay-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isFree && (
              <Badge className="bg-success text-success-foreground border-0">
                Free
              </Badge>
            )}
            {soldOut && (
              <Badge variant="destructive">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Category */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="capitalize bg-background/90 backdrop-blur-sm">
              {event.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(event.startDate)}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-lg font-bold text-foreground">
              {formatCurrency(event.price)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{event.availableSeats} seats left</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
