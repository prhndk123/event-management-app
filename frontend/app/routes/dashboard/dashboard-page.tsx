import { motion } from 'framer-motion';
import { BarChart3, Calendar, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { mockDashboardStats, mockChartData } from '~/data/mock-data';
import { formatCurrency } from '~/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Events', value: mockDashboardStats.totalEvents, icon: Calendar, color: 'text-primary' },
    { title: 'Total Revenue', value: formatCurrency(mockDashboardStats.totalRevenue), icon: DollarSign, color: 'text-success' },
    { title: 'Transactions', value: mockDashboardStats.totalTransactions, icon: CreditCard, color: 'text-info' },
    { title: 'Pending', value: mockDashboardStats.pendingConfirmations, icon: Users, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData.daily}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v) => formatCurrency((v as number | undefined) ?? 0)} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
