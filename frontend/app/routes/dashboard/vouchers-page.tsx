import { Plus, Search, Tag, Copy } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { formatCurrency, formatDate } from '~/types';
import { toast } from 'sonner';

// Temporary Mock Data
const MOCK_VOUCHERS = [
  {
    id: '1',
    code: 'EARLYBIRD20',
    discountAmount: 20,
    discountType: 'percentage',
    usageLimit: 100,
    usedCount: 85,
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    status: 'expired',
    event: 'Neon Music Festival 2024'
  },
  {
    id: '2',
    code: 'SUMMERSALE',
    discountAmount: 50000,
    discountType: 'fixed',
    usageLimit: 50,
    usedCount: 12,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'active',
    event: 'Tech Startup Summit'
  },
  {
    id: '3',
    code: 'VIPACCESS',
    discountAmount: 15,
    discountType: 'percentage',
    usageLimit: 10,
    usedCount: 0,
    startDate: '2024-05-01',
    endDate: '2024-05-30',
    status: 'scheduled',
    event: 'Yoga & Wellness Retreat'
  }
];

export default function VouchersPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Voucher code copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vouchers & Promos</h1>
          <p className="text-muted-foreground">
            Create and manage discount codes for your events.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Voucher
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Active Vouchers</CardTitle>
          <CardDescription>
            List of all discount codes and their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search vouchers..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_VOUCHERS.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded font-mono font-bold text-sm flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          {voucher.code}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground"
                          onClick={() => copyToClipboard(voucher.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {voucher.discountType === 'percentage' 
                        ? `${voucher.discountAmount}%` 
                        : formatCurrency(voucher.discountAmount)}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {voucher.event}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {voucher.usedCount} / {voucher.usageLimit}
                      </div>
                      <div className="w-24 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        voucher.status === 'active' ? 'default' : 
                        voucher.status === 'scheduled' ? 'outline' : 'secondary'
                      } className="capitalize">
                        {voucher.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm">Edit</Button>
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
