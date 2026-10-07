import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductCardSkeleton } from '../components/catalog/ProductCardSkeleton';
import { Navbar } from '../components/layout/Navbar';
import { CartDrawer } from '../components/cart/CartDrawer';
import { 
  Search, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  Zap, 
  ShieldCheck, 
  MessageCircle, 
  Truck
} from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import logoImg from '../assets/img/logoSinFondo.png';

const fallbackCatalogProducts: Product[] = [
  {
    id: 'cat-creatina-creapure',
    nombre: 'Creatina Creapure® Monohidratada 300g Micronizada',
    slug: 'creatina-creapure-monohidratada-300g',
    categoria: 'Suplementos',
    precio: 135000,
    precioAntes: 155000,
    descripcion: 'La creatina alemana de mayor pureza y absorción clínica a nivel mundial. Máxima potencia muscular y fuerza explosiva sin retención de líquidos.',
    imagenUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 15,
    badges: ['CREAPURE', 'TOP VENTAS'],
  },
  {
    id: 'cat-nitrovolt-preworkout',
    nombre: 'Pre-Entreno NitroVolt Extreme 30 Serv Focus & Pump',
    slug: 'pre-entreno-nitrovolt-extreme-30-serv',
    categoria: 'Suplementos',
    precio: 119000,
    precioAntes: 139000,
    descripcion: 'Energía explosiva, vascularización extrema y concentración implacable con Beta-Alanina, Citrulina y Cafeína Anhidra.',
    imagenUrl: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 20,
    badges: ['ENERGÍA EXTREMA', 'TOP 1'],
  },
  {
    id: 'cat-whey-isolate',
    nombre: 'Proteína Whey Isolate 100% Pura 2 lbs Chocolate Suizo',
    slug: 'proteina-whey-isolate-100-pura-2lbs',
    categoria: 'Suplementos',
    precio: 189000,
    precioAntes: 215000,
    descripcion: '27g de proteína isolada por porción, cero carbohidratos, cero azúcar y máxima biodisponibilidad digestiva.',
    imagenUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 12,
    badges: ['ISOLATE', '0 AZÚCAR'],
  },
  {
    id: 'cat-bcaa-glutamina',
    nombre: 'BCAA + Glutamina 4:1:1 Recuperador Nocturno 400g',
    slug: 'bcaa-glutamina-recuperador-400g',
    categoria: 'Suplementos',
    precio: 98000,
    precioAntes: 115000,
    descripcion: 'Aminoácidos de cadena ramificada con L-Glutamina fermentada para reparación muscular profunda y evitar el catabolismo.',
    imagenUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 18,
    badges: ['RECUPERACIÓN', 'ANTI-CATABÓLICO'],
  },
  {
    id: 'cat-electrolitos-pro',
    nombre: 'Electrolitos Ultra-Hydrate Zero Azúcar 30 Sachets',
    slug: 'electrolitos-ultra-hydrate-zero-azucar-30-sachets',
    categoria: 'Hidratación',
    precio: 85000,
    precioAntes: 99000,
    descripcion: 'Reposición celular rápida de sodio, potasio, magnesio y zinc para deportes de resistencia y alta sudoración.',
    imagenUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 25,
    badges: ['ZERO AZÚCAR', 'HIDRATACIÓN'],
  },
  {
    id: 'cat-iso-carbo-intra',
    nombre: 'Intra-Workout CarboHydrate + EAA 900g Frutos Rojos',
    slug: 'intra-workout-carbohydrate-eaa-900g',
    categoria: 'Hidratación',
    precio: 105000,
    precioAntes: 125000,
    descripcion: 'Ciclodextrina de absorción veloz con aminoácidos esenciales para sesiones intensas de alta demanda energética.',
    imagenUrl: 'https://images.unsplash.com/photo-1550572017-edd951b55104?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 14,
    badges: ['RESISTENCIA', 'INTRA-TRAIN'],
  },
  {
    id: 'cat-shaker-metal-pro',
    nombre: 'Shaker Pro Acero Inoxidable 750ml Térmico Aislado',
    slug: 'shaker-pro-acero-inoxidable-750ml',
    categoria: 'Accesorios',
    precio: 65000,
    precioAntes: 78000,
    descripcion: 'Botella mezcladora premium en acero quirúrgico libre de BPA, mantiene tus batidos fríos por 24 horas sin olores.',
    imagenUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 30,
    badges: ['ACERO 304', 'TÉRMICO'],
  },
  {
    id: 'cat-straps-pesas-pro',
    nombre: 'Lifting Straps Pro Grip Heavy Duty Cuero & Neopreno',
    slug: 'lifting-straps-pro-grip-heavy-duty',
    categoria: 'Accesorios',
    precio: 45000,
    precioAntes: 55000,
    descripcion: 'Correas de agarre para peso muerto y jalones pesados con acolchado de neopreno y refuerzo de doble costura.',
    imagenUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    stock: 22,
    badges: ['HEAVY DUTY', 'AGARRE TOTAL'],
  },
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoria');

  const [isLoading, setIsLoading] = useState(true);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'Todos');

  const [sortBy, setSortBy] = useState<'recientes' | 'precio-asc' | 'precio-desc'>('recientes');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    productService.getProducts().then((res) => {
      setActiveProducts(res.data.filter((p: any) => p.activo !== false));
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [categoryParam]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'Todos') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: cat });
    }
  };

  const categories = ['Todos', 'Suplementos', 'Hidratación', 'Accesorios'];

  // Combinar productos de la base de datos con catálogo base para una experiencia premium y nutrida
  const allCatalogProducts = useMemo(() => {
    const list = [...activeProducts];
    for (const item of fallbackCatalogProducts) {
      if (!list.some((p) => p.nombre.toLowerCase() === item.nombre.toLowerCase())) {
        list.push(item);
      }
    }
    return list;
  }, [activeProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allCatalogProducts];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(lowerSearch) || 
        p.descripcion.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedCategory !== 'Todos') {
      result = result.filter(p => p.categoria === selectedCategory);
    }

    switch (sortBy) {
      case 'precio-asc':
        result.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        result.sort((a, b) => b.precio - a.precio);
        break;
      case 'recientes':
      default:
        result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
    }

    return result;
  }, [allCatalogProducts, searchTerm, selectedCategory, sortBy]);

  // Contadores por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: allCatalogProducts.length,
      Suplementos: allCatalogProducts.filter(p => p.categoria === 'Suplementos').length,
      Hidratación: allCatalogProducts.filter(p => p.categoria === 'Hidratación').length,
      Accesorios: allCatalogProducts.filter(p => p.categoria === 'Accesorios').length,
    };
    return counts;
  }, [allCatalogProducts]);

  return (
    <div className="min-h-screen bg-dark-base bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] flex flex-col">
      <Navbar />
      <CartDrawer />
      
      {/* ══ HEADER DE ALTO IMPACTO ATLÉTICO ══ */}
      <div className="relative overflow-hidden border-b border-white/10 bg-dark-surface/60 py-8 sm:py-12 md:py-16">
        {/* Glows ambientales neón */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-volt/[0.06] blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[200px] bg-volt/[0.04] blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ccff00_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge superior */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-dark-base/80 border border-volt/30 backdrop-blur-md mb-3 sm:mb-5 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-volt shadow-[0_0_8px_#ccff00] animate-pulse" />
            <span className="text-volt font-mono font-black text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase">
              CATÁLOGO OFICIAL VICTORIA
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.95] mb-3 sm:mb-5">
            POTENCIA TU <span className="text-volt drop-shadow-[0_0_30px_rgba(204,255,0,0.45)]">RENDIMIENTO</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-5 sm:mb-8 px-2">
            Suplementación de grado élite, fórmulas puras certificadas y accesorios deportivos diseñados para superar tus límites.
          </p>

          {/* Micro-pills de confianza */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5 sm:gap-2 bg-dark-base/90 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-sm">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-volt" /> Pasto Express
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 bg-dark-base/90 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-volt" /> Registro INVIMA
            </span>
            <span className="flex items-center gap-1.5 sm:gap-2 bg-dark-base/90 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-sm">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-volt" /> Envíos Gratis &gt; $150k
            </span>
          </div>
        </div>
      </div>

      <main ref={catalogRef} className="flex-grow max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14 w-full relative z-10 scroll-mt-24 pb-24">
        
        {/* ══ BARRA DE BÚSQUEDA Y FILTROS PREMIUM ══ */}
        <div className="mb-6 sm:mb-10 space-y-3.5 sm:space-y-5">
          <div className="flex gap-2 sm:gap-3 items-center">
            
            {/* Search Bar con borde reactivo neón */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-focus-within:text-volt transition-colors" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proteínas, creatinas..."
                className="w-full bg-dark-surface/90 border border-white/10 rounded-xl sm:rounded-2xl pl-10 sm:pl-12 pr-9 sm:pr-11 py-2.5 sm:py-3.5 focus:border-volt focus:ring-2 focus:ring-volt/20 text-white placeholder-gray-500 text-xs sm:text-sm md:text-base outline-none transition-all shadow-md focus:shadow-[0_0_20px_rgba(204,255,0,0.15)]"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-volt transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown compacto en mobile */}
            <div className="relative z-20 shrink-0">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="bg-dark-surface/90 border border-white/10 hover:border-volt/50 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center gap-2 text-white transition-all text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(204,255,0,0.1)] active:scale-95"
                aria-label="Ordenar"
              >
                <SlidersHorizontal className="w-4 h-4 text-volt shrink-0" />
                <span className="hidden sm:inline">
                  {sortBy === 'recientes' && 'Más recientes'}
                  {sortBy === 'precio-asc' && 'Precio: Menor'}
                  {sortBy === 'precio-desc' && 'Precio: Mayor'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-volt transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-dark-surface border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden py-1 z-30 backdrop-blur-xl animate-fade-in-up">
                  <button 
                    onClick={() => { setSortBy('recientes'); setIsSortOpen(false); }} 
                    className={`w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${sortBy === 'recientes' ? 'bg-volt/10 text-volt border-l-2 border-volt' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Más recientes</span>
                    {sortBy === 'recientes' && <span className="w-1.5 h-1.5 rounded-full bg-volt" />}
                  </button>
                  <button 
                    onClick={() => { setSortBy('precio-asc'); setIsSortOpen(false); }} 
                    className={`w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${sortBy === 'precio-asc' ? 'bg-volt/10 text-volt border-l-2 border-volt' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Precio: Menor a Mayor</span>
                    {sortBy === 'precio-asc' && <span className="w-1.5 h-1.5 rounded-full bg-volt" />}
                  </button>
                  <button 
                    onClick={() => { setSortBy('precio-desc'); setIsSortOpen(false); }} 
                    className={`w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${sortBy === 'precio-desc' ? 'bg-volt/10 text-volt border-l-2 border-volt' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <span>Precio: Mayor a Menor</span>
                    {sortBy === 'precio-desc' && <span className="w-1.5 h-1.5 rounded-full bg-volt" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Category Pills con contador interactivo */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-3 px-3 sm:mx-0 sm:px-0 w-full sm:w-auto scroll-smooth">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                const count = categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`shrink-0 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border active:scale-95 ${
                      isActive 
                        ? 'bg-volt text-dark-base border-volt shadow-[0_0_15px_rgba(204,255,0,0.35)]' 
                        : 'bg-dark-surface/80 border-white/10 text-gray-400 hover:text-white hover:border-volt/40 hover:bg-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded font-mono ${isActive ? 'bg-dark-base text-volt' : 'bg-white/5 text-gray-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Contador de resultados */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-gray-400 font-bold uppercase tracking-wider ml-auto sm:ml-0">
              <span className="w-1.5 h-1.5 rounded-full bg-volt animate-pulse" />
              <span>{filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'producto' : 'productos'}</span>
            </div>
          </div>

        </div>

        {/* ══ GRID DEL CATÁLOGO ══ */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center border border-white/10 rounded-3xl bg-dark-surface/50 backdrop-blur-md p-8">
            <div className="w-16 h-16 rounded-2xl bg-volt/10 border border-volt/20 flex items-center justify-center mb-5 text-volt">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">No se encontraron productos</h3>
            <p className="text-gray-400 mb-8 max-w-md text-sm md:text-base leading-relaxed">
              No hay suplementos o accesorios que coincidan con &quot;{searchTerm || selectedCategory}&quot;. Intenta con otro término o consulta con nuestro Coach.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
                className="px-6 py-3.5 bg-dark-base border border-volt/40 text-volt hover:bg-volt hover:text-dark-base font-black uppercase tracking-wider text-xs md:text-sm rounded-xl transition-all shadow-lg active:scale-95"
              >
                Restablecer Filtros
              </button>
              <a
                href="https://wa.me/573000000000?text=Hola,%20estoy%20buscando%20un%20producto%20específico%20en%20Victoria."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-volt text-dark-base font-black uppercase tracking-wider text-xs md:text-sm rounded-xl transition-all hover:bg-volt-hover flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> Preguntar por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* ══ BANNER COACH AL PIE DEL CATÁLOGO ══ */}
        <div className="mt-20 md:mt-28">
          <div className="relative overflow-hidden rounded-3xl border border-volt/30 bg-gradient-to-br from-[#121824] via-dark-surface to-[#0B0F17] shadow-[0_0_50px_rgba(204,255,0,0.1)] p-8 md:p-12">
            <div className="absolute top-0 right-0 w-80 h-80 bg-volt/10 rounded-full blur-[90px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left max-w-xl">
                <span className="text-volt font-mono font-black text-xs tracking-[0.25em] uppercase block mb-3">
                  ¿NO ENCUENTRAS LO QUE BUSCAS?
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-3">
                  Te conseguimos tu suplemento o te armamos el combo exacto
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  Pregúntanos por WhatsApp si requieres alguna marca importada específica o asesoría personalizada según tu plan de entrenamiento.
                </p>
              </div>

              <a
                href="https://wa.me/573000000000?text=Hola,%20busco%20asesoría%20sobre%20los%20productos%20del%20catálogo."
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-3 bg-volt text-dark-base px-8 py-4.5 rounded-2xl font-black uppercase tracking-wider text-sm hover:bg-volt-hover transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(204,255,0,0.35)] active:scale-95"
              >
                <MessageCircle className="w-5 h-5 text-dark-base" />
                Hablar con un Asesor
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* ══ FOOTER ELEVADO ══ */}
      <footer className="relative border-t border-white/5 bg-dark-surface overflow-hidden mt-auto">
        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-volt/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <Link to="/" className="flex items-center group">
              <img src={logoImg} alt="Victoria" className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(204,255,0,0.35)]" />
              <span className="font-black italic uppercase text-white text-xl tracking-tighter ml-[-2px] group-hover:text-volt transition-colors">
                ICTORIA
              </span>
            </Link>

            <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Link to="/catalogo?categoria=Suplementos" className="hover:text-volt transition-colors">Suplementos</Link>
              <Link to="/catalogo?categoria=Hidratación" className="hover:text-volt transition-colors">Hidratación</Link>
              <Link to="/catalogo?categoria=Accesorios" className="hover:text-volt transition-colors">Accesorios</Link>
              <span className="hidden md:inline text-white/10">|</span>
              <Link to="/envios" className="hover:text-volt transition-colors">Políticas de Envío</Link>
              <Link to="/terminos" className="hover:text-volt transition-colors">Términos</Link>
            </div>

            <p className="text-xs text-gray-500 font-medium text-center md:text-right">
              © {new Date().getFullYear()} Victoria Performance Nutrition.<br />Pasto, Colombia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
