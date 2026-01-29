import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, Calendar } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { EventCard } from '~/components/events/event-card';
import { EmptyState } from '~/components/shared/empty-state';
import { useEventStore } from '~/store/event-store';
import { EVENT_CATEGORIES, LOCATIONS, EventCategory } from '~/types';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    getFilteredEvents 
  } = useEventStore();

  // Debounced search
  const [searchInput, setSearchInput] = useState(filters.search);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchInput });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setFilters]);

  // Sync URL params with filters
  useEffect(() => {
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    if (category && EVENT_CATEGORIES.some(c => c.value === category)) {
      setFilters({ category: category as EventCategory });
    }
    if (location && LOCATIONS.includes(location)) {
      setFilters({ location });
    }
  }, [searchParams, setFilters]);

  const filteredEvents = useMemo(() => getFilteredEvents(), [getFilteredEvents, filters]);

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.location !== 'all' || 
    filters.priceRange !== 'all' ||
    filters.search;

  const handleClearFilters = () => {
    resetFilters();
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Events</h1>
          <p className="text-muted-foreground">
            Discover {filteredEvents.length} amazing events near you
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl border border-border p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, venues, locations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 input-focus"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ category: value as EventCategory | 'all' })}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ location: value })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.priceRange}
                onValueChange={(value) => setFilters({ priceRange: value as 'all' | 'free' | 'paid' })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-border space-y-3"
            >
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ category: value as EventCategory | 'all' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.location}
                onValueChange={(value) => setFilters({ location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Locations</SelectItem>
                  {LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.priceRange}
                onValueChange={(value) => setFilters({ priceRange: value as 'all' | 'free' | 'paid' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </motion.div>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No events found"
            description="We couldn't find any events matching your criteria. Try adjusting your filters or search terms."
            action={{
              label: 'Clear Filters',
              onClick: handleClearFilters,
            }}
          />
        )}
      </div>
    </div>
  );
}
