import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import { ProductCardSkeleton } from '../components/catalog/ProductCardSkeleton';
import { Navbar } from '../components/layout/Navbar';
import { CartDrawer } from '../components/cart/CartDrawer';
import { useAdminStore } from '../store/useAdminStore';
import { Zap, ShieldCheck, Award, Plus, Minus, MessageCircle, Search, X, ChevronDown, Target } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoria');

  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const allProducts = useAdminStore((state) => state.products);
  const activeProducts = allProducts.filter(p => p.activo !== false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'Todos');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recientes' | 'precio-asc' | 'precio-desc'>('recientes');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedGoal, sortBy]);

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

  const goals = [
    { label: 'Aumento Muscular', keywords: ['protein', 'hyper', 'aislado', 'masa', 'whey'] },
    { label: 'Definición', keywords: ['zero sugar', 'definición'] },
    { label: 'Fuerza / Energía', keywords: ['high energy', 'fuerza', 'pre-entreno', 'creatina'] },
    { label: 'Recuperación', keywords: ['recuperación', 'glutamina', 'bcaa'] }
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...activeProducts];

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

    if (selectedGoal) {
      const goalObj = goals.find(g => g.label === selectedGoal);
      if (goalObj) {
        result = result.filter(p => {
          const searchStr = `${p.nombre} ${p.descripcion} ${p.badges.join(' ')}`.toLowerCase();
          return goalObj.keywords.some(kw => searchStr.includes(kw));
        });
      }
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
        result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return result;
  }, [activeProducts, searchTerm, selectedCategory, sortBy]);

  const faqs = [
    {
      q: '¿Cómo funciona el envío y cuánto tarda?',
      a: 'Para Medellín y el Área Metropolitana ofrecemos envíos el mismo día por un costo fijo de $8.000 COP. A nivel nacional, despachamos vía transportadora con pago contra entrega (tiempo estimado de 48 a 72 horas hábiles).'
    },
    {
      q: '¿Es seguro pagar con Nequi o Transferencia?',
      a: 'Sí, 100% seguro. Al finalizar tu pedido, el sistema genera tu orden y te conectamos directamente a nuestro WhatsApp oficial. Allí enviarás tu comprobante y un asesor validará tu pago inmediatamente.'
    },
    {
      q: '¿Tienen garantía los productos?',
      a: 'Absolutamente. Todos nuestros suplementos cuentan con registro sanitario INVIMA, sellos de autenticidad y fecha de caducidad vigente. Tu rendimiento y salud son nuestra prioridad.'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-base flex flex-col">
      <Navbar />
      <CartDrawer />
      
      {/* Hero Section */}
      <div className="relative pt-8 pb-6 md:pt-24 md:pb-12 overflow-hidden border-b border-dark-border bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/80 to-transparent" />
        <div className="absolute inset-0 bg-dark-base/70 md:bg-dark-base/50" />
        
        {/* Abstract shapes (Desktop only) */}
        <div className="hidden md:block absolute top-0 right-0 -mr-32 -mt-32 w-[600px] h-[600px] bg-volt opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-0 -ml-32 -mb-32 w-[600px] h-[600px] bg-volt opacity-[0.02] rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[1.1] md:leading-[0.9]">
              Potencia Tu <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-volt via-emerald-400 to-cyan-500 animate-gradient-x">Rendimiento</span>
            </h1>
            <p className="mt-2 md:mt-6 text-xs md:text-lg text-slate-300 md:text-gray-400 max-w-xl font-medium line-clamp-2 md:line-clamp-none">
              Suplementación deportiva de élite para atletas que no conocen los límites. Calidad premium, resultados reales.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full relative z-10 pb-12">
        
        <div ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full scroll-mt-24">
          {/* Search & Filters */}
          <div className="mb-6 md:mb-10 space-y-4 md:space-y-6">
            <div className="flex gap-2 justify-between items-center">
              
              {/* Search Bar */}
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-volt transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar suplementos..."
                  className="w-full bg-dark-surface border border-dark-border rounded-xl pl-10 md:pl-12 pr-10 py-2.5 md:py-3.5 focus:border-volt focus:ring-1 focus:ring-volt text-white text-sm md:text-base outline-none transition-all shadow-inner"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative z-20 shrink-0">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-dark-surface border border-dark-border hover:border-volt/50 rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 flex justify-center items-center text-white transition-colors"
                  aria-label="Ordenar"
                >
                  <ChevronDown className={`w-5 h-5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-xl shadow-2xl overflow-hidden">
                    <button onClick={() => { setSortBy('recientes'); setIsSortOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-card hover:text-white transition-colors">Más recientes</button>
                    <button onClick={() => { setSortBy('precio-asc'); setIsSortOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-card hover:text-white transition-colors">Precio: Menor a Mayor</button>
                    <button onClick={() => { setSortBy('precio-desc'); setIsSortOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-dark-card hover:text-white transition-colors">Precio: Mayor a Menor</button>
                  </div>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`shrink-0 px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-volt/10 border-volt/30 text-volt' 
                      : 'bg-dark-card border-dark-border text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Goal Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 shrink-0">
                <Target className="w-3 h-3 mr-1" /> Objetivo:
              </span>
              {goals.map(goal => (
                <button
                  key={goal.label}
                  onClick={() => setSelectedGoal(selectedGoal === goal.label ? '' : goal.label)}
                  className={`shrink-0 px-3 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedGoal === goal.label 
                      ? 'bg-white border-white text-dark-base' 
                      : 'bg-transparent border-dark-border text-gray-500 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-dark-border rounded-2xl bg-dark-surface/50">
              <Search className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No se encontraron productos</h3>
              <p className="text-gray-400 mb-6 max-w-md">No hay suplementos o accesorios que coincidan con tu búsqueda o filtros actuales.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}
                className="px-6 py-3 bg-dark-card border border-dark-border hover:border-volt hover:text-volt text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all"
              >
                Restablecer Filtros
              </button>
            </div>
          )}
        </div>

        {/* Compra por Objetivo (Sección Inmersiva) */}
        <div className="w-full bg-dark-surface/50 border-y border-dark-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
                ¿Cuál es tu <span className="text-volt">Objetivo?</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Selecciona tu meta y descubre la suplementación exacta que necesitas para romper tus propios récords.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Tarjeta 1 */}
              <div onClick={() => setSelectedGoal('Aumento Muscular')} className="group relative h-80 md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-volt font-mono font-bold tracking-widest text-xs mb-2">01 / HYPERTROPHY</span>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none mb-4">Ganar<br/>Masa</h3>
                  <div className="w-10 h-1 bg-volt transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div onClick={() => setSelectedGoal('Definición')} className="group relative h-80 md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-volt font-mono font-bold tracking-widest text-xs mb-2">02 / SHREDDED</span>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none mb-4">Definición<br/>Extrema</h3>
                  <div className="w-10 h-1 bg-volt transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div onClick={() => setSelectedGoal('Fuerza / Energía')} className="group relative h-80 md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-volt font-mono font-bold tracking-widest text-xs mb-2">03 / STRENGTH</span>
                  <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none mb-4">Fuerza &<br/>Energía</h3>
                  <div className="w-10 h-1 bg-volt transform origin-left group-hover:scale-x-150 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Asesoría Coach Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
          <div className="bg-volt rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-[0_0_50px_-12px_rgba(204,255,0,0.4)] transition-shadow duration-500">
            {/* Elementos decorativos */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none mix-blend-overlay" />
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-4xl font-black text-dark-base uppercase tracking-tighter mb-2">
                ¿No sabes qué tomar?
              </h3>
              <p className="text-dark-surface font-semibold max-w-md">
                Habla directamente con nuestro Coach Deportivo. Te armamos el combo exacto para tu metabolismo y objetivos sin compromiso.
              </p>
            </div>

            <a 
              href="https://wa.me/573000000000?text=Hola,%20necesito%20asesoría%20con%20mi%20suplementación." 
              target="_blank" 
              rel="noreferrer"
              className="relative z-10 bg-dark-base text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-dark-surface transition-colors flex items-center gap-3 shrink-0 group active:scale-95"
            >
              <MessageCircle className="w-6 h-6 text-volt animate-pulse" />
              Chat con el Coach
            </a>
          </div>
        </div>

      </main>

      {/* Trust Grid */}
      <section className="border-t border-dark-border bg-dark-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-dark-card border border-dark-border rounded-2xl">
              <div className="w-14 h-14 bg-volt/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-volt" />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Despacho Inmediato</h4>
              <p className="text-gray-400 text-sm">Entregas el mismo día para pedidos locales en Medellín y Área Metropolitana.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-dark-card border border-dark-border rounded-2xl">
              <div className="w-14 h-14 bg-volt/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-volt" />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Compra Segura</h4>
              <p className="text-gray-400 text-sm">Validación directa y personalizada vía WhatsApp con tu comprobante de pago.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-dark-card border border-dark-border rounded-2xl">
              <div className="w-14 h-14 bg-volt/10 rounded-full flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-volt" />
              </div>
              <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">Calidad Garantizada</h4>
              <p className="text-gray-400 text-sm">Productos 100% originales de las mejores marcas, con registro INVIMA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center justify-center gap-3 mb-10">
            <span className="w-8 h-1 bg-volt block rounded-full" />
            Preguntas Frecuentes
            <span className="w-8 h-1 bg-volt block rounded-full" />
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-white pr-4">{faq.q}</span>
                  <div className={`p-1 rounded-full transition-colors ${openFaq === index ? 'bg-volt/10 text-volt' : 'text-gray-500'}`}>
                    {openFaq === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-dark-border bg-dark-surface py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center transform -skew-x-12">
              <span className="text-dark-base font-black text-sm italic">V</span>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">Victoria</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-gray-500">
            <Link to="/?categoria=Suplementos" className="hover:text-volt transition-colors">Suplementos</Link>
            <Link to="/?categoria=Hidratación" className="hover:text-volt transition-colors">Hidratación</Link>
            <Link to="/?categoria=Accesorios" className="hover:text-volt transition-colors">Accesorios</Link>
            <span className="hidden md:inline text-dark-border">|</span>
            <Link to="/envios" className="hover:text-volt transition-colors">Políticas de Envío</Link>
            <Link to="/terminos" className="hover:text-volt transition-colors">Términos y Garantías</Link>
          </div>

          <p className="text-sm text-gray-500 font-medium text-center md:text-right">
            © {new Date().getFullYear()} Victoria Performance.<br/>Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
