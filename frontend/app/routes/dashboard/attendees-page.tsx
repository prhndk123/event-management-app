import { Search, Mail, Download, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

// Temporary Mock Data
const MOCK_ATTENDEES = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    event: 'Neon Music Festival 2024',
    ticketType: 'VIP Pass',
    status: 'checked_in',
    checkInTime: '2024-05-20T18:45:00',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80'
  },
  {
    id: '2',
    name: 'James Cameron',
    email: 'james@example.com',
    event: 'Neon Music Festival 2024',
    ticketType: 'Regular',
    status: 'registered',
    checkInTime: null,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'
  },
  {
    id: '3',
    name: 'Ellen Ripley',
    email: 'ellen@example.com',
    event: 'Tech Startup Summit',
    ticketType: 'Speaker',
    status: 'registered',
    checkInTime: null,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
  },
  {
    id: '4',
    name: 'Marty McFly',
    email: 'marty@future.com',
    event: 'Tech Startup Summit',
    ticketType: 'General Admission',
    status: 'checked_in',
    checkInTime: '2024-06-15T08:30:00',
    avatar: ''
  }
];

export default function AttendeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendees</h1>
          <p className="text-muted-foreground">
             Manage attendee lists and check-in status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" /> Email All
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Attendee List</CardTitle>
          <CardDescription>
            List of all registered attendees across your events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="neon">Neon Music Festival</SelectItem>
                <SelectItem value="tech">Tech Startup Summit</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attendee</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Check-in Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ATTENDEES.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={person.avatar} />
                          <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{person.name}</span>
                          <span className="text-xs text-muted-foreground">{person.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{person.event}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{person.ticketType}</Badge>
                    </TableCell>
                    <TableCell>
                      {person.status === 'checked_in' ? (
                         <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                           <CheckCircle2 className="h-4 w-4" />
                           Checked In
                         </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                           <div className="h-2 w-2 rounded-full bg-gray-300" />
                           Registered
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Details</Button>
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
