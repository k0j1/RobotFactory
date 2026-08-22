import React from 'react';
import { FaCubes, FaCog, FaVial, FaFan, FaLightbulb, FaFlask, FaQuestion } from 'react-icons/fa';

interface Props {
  materialId: string;
  size?: number;
  className?: string;
  color?: string;
}

export const MaterialIcon: React.FC<Props> = ({ materialId, size = 16, className = '', color }) => {
  const props = { size, className, color };
  switch (materialId) {
    case 'm1': return <FaCubes {...props} />;
    case 'm2': return <FaCog {...props} />;
    case 'm3': return <FaVial {...props} />;
    case 'm4': return <FaFan {...props} />;
    case 'm5': return <FaLightbulb {...props} />;
    case 'm6': return <FaFlask {...props} />;
    default: return <FaQuestion {...props} />;
  }
};
