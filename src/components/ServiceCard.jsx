import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  gradient = "from-green-500 to-emerald-600",
  disabled = false,
  size = "large" // "large" or "small"
}) {
  if (size === "small") {
    return (
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden ${disabled ? 'opacity-50' : ''}`} 
        onClick={!disabled ? onClick : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
        <CardContent className="p-4 text-center">
          <div className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-8 h-8 mx-auto ${gradient.includes('blue') ? 'text-blue-500' : gradient.includes('red') ? 'text-red-500' : gradient.includes('green') ? 'text-green-500' : gradient.includes('purple') ? 'text-purple-500' : gradient.includes('yellow') ? 'text-yellow-500' : gradient.includes('cyan') ? 'text-cyan-500' : 'text-green-600'}`} />
          </div>
          <p className="text-sm font-medium text-gray-800 group-hover:text-green-700 transition-colors">
            {title}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 overflow-hidden ${disabled ? 'opacity-50' : ''}`} 
      onClick={!disabled ? onClick : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      aria-label={`${title} service`}
    >
      <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-6 h-6 text-green-600" />
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors duration-300 group-hover:translate-x-1" />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
