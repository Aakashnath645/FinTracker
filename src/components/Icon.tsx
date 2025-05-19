import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, className, color }) => {
  const LucideIcon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  
  return <LucideIcon className={className} color={color} />;
};

export default Icon;