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
  
  if (materialId.startsWith('m_e')) return <FaCubes {...props} />;
  if (materialId.startsWith('m_f')) return <FaCog {...props} />;
  if (materialId.startsWith('m_w')) return <FaVial {...props} />;
  if (materialId.startsWith('m_a')) return <FaFan {...props} />;
  if (materialId.startsWith('m_l')) return <FaLightbulb {...props} />;
  if (materialId.startsWith('m_d')) return <FaFlask {...props} />;
  return <FaQuestion {...props} />;

};
