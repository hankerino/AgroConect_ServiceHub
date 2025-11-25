import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  iconColor?: string;
  iconBg?: string;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100'
}: ServiceCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full border-2 hover:border-emerald-200 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
          <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
