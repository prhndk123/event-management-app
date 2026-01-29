import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatCurrency } from '~/types';
import { Download, Calendar } from 'lucide-react';
import { Button } from '~/components/ui/button';

// Mock Data
const REVENUE_DATA = [
  { name: 'Jan', revenue: 12500000 },
  { name: 'Feb', revenue: 18000000 },
  { name: 'Mar', revenue: 15600000 },
  { name: 'Apr', revenue: 22400000 },
  { name: 'May', revenue: 28900000 },
  { name: 'Jun', revenue: 35000000 },
];

const CATEGORY_DATA = [
  { name: 'Music', value: 45 },
  { name: 'Tech', value: 25 },
  { name: 'Business', value: 15 },
  { name: 'Arts', value: 10 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TOP_EVENTS_DATA = [
  { name: 'Neon Festival', tickets: 1250 },
  { name: 'Tech Summit', tickets: 850 },
  { name: 'Yoga Retreat', tickets: 450 },
  { name: 'Food Expo', tickets: 320 },
  { name: 'Art Gallery', tickets: 210 },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistics & Analytics</h1>
          <p className="text-muted-foreground">
            Visualize your event performance and revenue data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Last 6 Months
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue performance over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `Rp${value / 1000000}M`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Sales by Category</CardTitle>
            <CardDescription>Distribution of ticket sales across event categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Events */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Events</CardTitle>
            <CardDescription>Events with the highest ticket sales volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_EVENTS_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
