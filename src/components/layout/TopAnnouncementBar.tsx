import React from 'react';
import { Zap, Flame, Package, ShieldCheck } from 'lucide-react';

export const TopAnnouncementBar: React.FC = () => {
  const announcements = [
    { icon: <Zap className="w-3 h-3 md:w-4 md:h-4 text-volt" />, text: "ENVÍOS GRATIS EN PASTO POR COMPRAS MAYORES A $150.000" },
    { icon: <Flame className="w-3 h-3 md:w-4 md:h-4 text-volt" />, text: "PAGA FÁCIL CON NEQUI O TRANSFERENCIA" },
    { icon: <Package className="w-3 h-3 md:w-4 md:h-4 text-volt" />, text: "DESPACHOS EN MENOS DE 24 HORAS" },
    { icon: <ShieldCheck className="w-3 h-3 md:w-4 md:h-4 text-volt" />, text: "GARANTÍA DE ORIGINALIDAD EN TODOS LOS PRODUCTOS" },
  ];

  return (
    <div className="bg-dark-base border-b border-dark-border py-2 overflow-hidden flex whitespace-nowrap relative z-50">
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {/* Render twice for seamless loop */}
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center shrink-0">
            {announcements.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mx-8 shrink-0">
                {item.icon}
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-300">
                  {item.text}
                </span>
                <span className="mx-8 text-dark-border">/</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
