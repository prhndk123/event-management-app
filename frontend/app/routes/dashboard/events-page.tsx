import { Link } from 'react-router';
import { Plus, Search, MoreHorizontal, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { formatCurrency, formatDateTime } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

// Temporary Mock Data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'Neon Music Festival 2024',
    category: 'music',
    location: 'GBK Stadium, Jakarta',
    date: '2024-05-20T18:00:00',
    price: 1500000,
    status: 'published',
    sold: 1250,
    total: 2000,
    image: 'https://images.unsplash.com/photo-1459749411177-2a25413fe3dd?w=800&q=80',
  },
  {
    id: '2',
    title: 'Tech Startup Summit',
    category: 'business',
    location: 'Grand Hyatt, Bali',
    date: '2024-06-15T09:00:00',
    price: 3500000,
    status: 'draft',
    sold: 0,
    total: 500,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: '3',
    title: 'Yoga & Wellness Retreat',
    category: 'health',
    location: 'Ubud, Bali',
    date: '2024-07-01T07:00:00',
    price: 500000,
    status: 'completed',
    sold: 48,
    total: 50,
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
  }
];

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your events, track sales, and view performance.
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/events/create">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            A list of all your events including their title, date, location, and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Event Details</TableHead>
                  <TableHead>Date & Location</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_EVENTS.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={event.image} alt={event.title} className="object-cover" />
                        <AvatarFallback className="rounded-lg">EV</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{event.category}</div>
                      <div className="text-xs font-semibold mt-1">
                        {formatCurrency(event.price)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(event.date)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {event.sold} / {event.total}
                      </div>
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(event.sold / event.total) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        event.status === 'published' ? 'default' : 
                        event.status === 'completed' ? 'secondary' : 'outline'
                      } className="capitalize">
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/events/${event.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/events/${event.id}/edit`}>Edit Event</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete Event
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
