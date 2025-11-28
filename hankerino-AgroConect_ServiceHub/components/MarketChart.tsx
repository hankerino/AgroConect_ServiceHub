import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', soja: 140, milho: 50 },
  { name: 'Feb', soja: 145, milho: 52 },
  { name: 'Mar', soja: 155, milho: 55 },
  { name: 'Apr', soja: 162, milho: 58 },
  { name: 'May', soja: 158, milho: 56 },
  { name: 'Jun', soja: 168, milho: 60 },
  { name: 'Jul', soja: 170, milho: 59 },
];

export const MarketChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSoja" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMilho" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`R$ ${value}`, '']}
          />
          <Area type="monotone" dataKey="soja" stroke="#10b981" fillOpacity={1} fill="url(#colorSoja)" name="Soja" strokeWidth={2} />
          <Area type="monotone" dataKey="milho" stroke="#f59e0b" fillOpacity={1} fill="url(#colorMilho)" name="Milho" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};