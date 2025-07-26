import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const EarningsChart = ({ data, period, totalEarnings, pendingPayout }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-warm p-3">
          <p className="text-sm font-medium text-foreground mb-1">
            {period === 'daily' ? `Day ${label}` : 
             period === 'weekly' ? `Week ${label}` : 
             `Month ${label}`}
          </p>
          <p className="text-sm text-primary font-semibold">
            Earnings: ₹{payload[0].value.toFixed(2)}
          </p>
          {payload[0].payload.orders && (
            <p className="text-xs text-muted-foreground">
              Orders: {payload[0].payload.orders}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (value) => {
    if (period === 'daily') return `Day ${value}`;
    if (period === 'weekly') return `W${value}`;
    return `M${value}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Earnings Overview
          </h3>
          <p className="text-sm text-muted-foreground">
            {period === 'daily' ? 'Last 30 days' :
             period === 'weekly'? 'Last 12 weeks' : 'Last 12 months'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            ₹{totalEarnings.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Total {period} earnings
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {period === 'daily' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                tickFormatter={formatXAxisLabel}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                tickFormatter={formatXAxisLabel}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="earnings" 
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            ₹{data.reduce((sum, item) => sum + item.earnings, 0).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Period Total</p>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="ShoppingCart" size={20} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            {data.reduce((sum, item) => sum + (item.orders || 0), 0)}
          </p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="DollarSign" size={20} className="text-accent" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            ₹{(data.reduce((sum, item) => sum + item.earnings, 0) / Math.max(data.filter(item => item.orders > 0).length, 1)).toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Avg per Day</p>
        </div>
        
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Icon name="Clock" size={20} className="text-warning" />
          </div>
          <p className="text-lg font-semibold text-foreground">
            ₹{pendingPayout.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Pending Payout</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;