import type { Product } from '../types';

export const products: Product[] = [
  // Suplementos
  {
    id: '1',
    nombre: 'Proteína Whey Isolate 2 lb',
    slug: 'proteina-whey-isolate',
    categoria: 'Suplementos',
    precio: 185000,
    precioAntes: 210000,
    descripcion: 'Aislado de proteína de suero de leche ultra puro. Rápida absorción para máxima recuperación muscular post-entrenamiento.',
    imagenUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 15,
    badges: ['27G PROTEIN']
  },
  {
    id: '2',
    nombre: 'Creatina Monohidratada Creapure 300g',
    slug: 'creatina-creapure',
    categoria: 'Suplementos',
    precio: 120000,
    descripcion: 'Incrementa la fuerza y el rendimiento explosivo. Sello Creapure original de Alemania.',
    imagenUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 30,
    badges: ['100% PURA']
  },
  {
    id: '3',
    nombre: 'Pre-Entreno Nitro Surge 30 Serv',
    slug: 'pre-entreno-nitro-surge',
    categoria: 'Suplementos',
    precio: 145000,
    precioAntes: 160000,
    descripcion: 'Energía extrema y bombeos musculares intensos. Con cafeína anhidra y citrulina.',
    imagenUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 20,
    badges: ['HIGH ENERGY']
  },
  {
    id: '4',
    nombre: 'Mass Gainer Pro 5 lb',
    slug: 'mass-gainer-pro',
    categoria: 'Suplementos',
    precio: 160000,
    descripcion: 'Fórmula hipercalórica para ganancia rápida de peso y masa muscular.',
    imagenUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 12,
    badges: ['HYPER CALORIC']
  },

  // Hidratación
  {
    id: '5',
    nombre: 'Bebida Isotónica Electro Electrolytes 500ml',
    slug: 'bebida-isotonica',
    categoria: 'Hidratación',
    precio: 9500,
    descripcion: 'Repón electrolitos y minerales perdidos durante el entrenamiento intenso.',
    imagenUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 100,
    badges: ['HYDRATION']
  },
  {
    id: '6',
    nombre: 'Recovery BCAA + Glutamina 300g',
    slug: 'bcaa-glutamina',
    categoria: 'Hidratación',
    precio: 110000,
    descripcion: 'Aminoácidos ramificados para reducir la fatiga muscular y acelerar la recuperación intrabebida.',
    imagenUrl: 'https://images.unsplash.com/photo-1603504829379-b1d5bf53075c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 25,
    badges: ['RECUPERACIÓN']
  },
  {
    id: '7',
    nombre: 'Tabletas Efervescentes Mineral Boost',
    slug: 'tabletas-mineral-boost',
    categoria: 'Hidratación',
    precio: 35000,
    descripcion: 'Pastillas efervescentes para enriquecer tu agua con magnesio y potasio.',
    imagenUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 45,
    badges: ['ZERO SUGAR']
  },

  // Accesorios
  {
    id: '8',
    nombre: 'Shaker Mezclador Pro 700ml',
    slug: 'shaker-mezclador-pro',
    categoria: 'Accesorios',
    precio: 28000,
    descripcion: 'Vaso mezclador anti-derrames con rejilla para batidos sin grumos. Plástico resistente.',
    imagenUrl: 'https://images.unsplash.com/photo-1616782299839-44585a21db40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 50,
    badges: ['BPA FREE']
  },
  {
    id: '9',
    nombre: 'Straps de Agarre Pesado Neopreno',
    slug: 'straps-agarre-pesado',
    categoria: 'Accesorios',
    precio: 45000,
    descripcion: 'Correas de agarre con almohadilla de neopreno para protección de muñecas en peso muerto.',
    imagenUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 35,
    badges: ['HEAVY DUTY']
  },
  {
    id: '10',
    nombre: 'Cinto de Levantamiento Lumbar Cuero',
    slug: 'cinto-levantamiento',
    categoria: 'Accesorios',
    precio: 135000,
    descripcion: 'Cinturón de cuero legítimo para estabilización máxima en sentadillas y levantamientos.',
    imagenUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 10,
    badges: ['PRO SUPPORT']
  },
  {
    id: '11',
    nombre: 'Bandas Elásticas de Resistencia Pack x3',
    slug: 'bandas-elasticas',
    categoria: 'Accesorios',
    precio: 55000,
    descripcion: 'Set de 3 bandas de tela antideslizantes para activación de glúteos y movilidad.',
    imagenUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 40,
    badges: ['3 NIVELES']
  }
];
