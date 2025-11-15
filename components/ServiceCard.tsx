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
      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
        <CardContent className="p-6">
          <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
