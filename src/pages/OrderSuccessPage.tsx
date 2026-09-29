import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { OrderPayload } from '../types';
import { CheckCircle2, Copy, MessageCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { generateWhatsAppUrl } from '../utils/whatsapp';
import { Navbar } from '../components/layout/Navbar';

export const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderPayload | null>(null);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!order) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado al portapapeles`);
  };

  const retryWhatsApp = () => {
    const url = generateWhatsAppUrl(order);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-dark-base text-gray-200">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center">
        
        {/* Header Exito */}
        <div className="w-20 h-20 bg-volt/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-volt rounded-full blur-xl opacity-20 animate-pulse" />
          <CheckCircle2 className="w-10 h-10 text-volt relative z-10" />
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2 text-center">
          ¡Orden Generada!
        </h1>
        <p className="text-gray-400 text-center mb-8 max-w-md">
          Tu pedido está listo para ser confirmado vía WhatsApp. A continuación encontrarás los datos para realizar la transferencia.
        </p>

        {/* Recibo Táctico */}
        <div className="w-full bg-dark-surface border border-dark-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-dark-card p-6 border-b border-dark-border flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Orden No.</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-white">{order.codigoPedido}</span>
                <span className="bg-volt/10 text-volt text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border border-volt/20">
                  Pendiente
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Total a Pagar</p>
              <span className="font-mono text-2xl font-black text-white">${order.total.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6 bg-dark-base relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-volt opacity-[0.02] blur-2xl pointer-events-none" />
            
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-6 bg-volt rounded-full inline-block" />
              Datos de Transferencia ({order.metodoPago === 'nequi' ? 'Nequi' : 'Bancolombia'})
            </h3>

            {order.metodoPago === 'nequi' ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Número de Celular (Nequi)</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-wider">300 123 4567</p>
                  <p className="text-xs text-gray-500 mt-1">A nombre de: Victoria</p>
                </div>
                <button 
                  onClick={() => handleCopy('3001234567', 'Número Nequi')}
                  className="px-4 py-2 bg-dark-surface border border-dark-border hover:border-volt hover:text-volt text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Copy className="w-4 h-4" /> Copiar
                </button>
              </div>
            ) : (
              <div className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Cuenta de Ahorros Bancolombia</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-wider">012 3456 7890</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Titular</p>
                      <p className="text-sm font-semibold text-white">Victoria</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">NIT</p>
                      <p className="text-sm font-semibold text-white">901.234.567-8</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('01234567890', 'Número de Cuenta')}
                  className="px-4 py-2 bg-dark-surface border border-dark-border hover:border-volt hover:text-volt text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shrink-0 sm:self-start"
                >
                  <Copy className="w-4 h-4" /> Copiar
                </button>
              </div>
            )}
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm text-yellow-500/90 font-medium">
                <strong>Importante:</strong> Tu pedido no será procesado hasta que confirmemos el pago. Por favor, envía el comprobante de transferencia al chat de WhatsApp generado.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-10 space-y-4 w-full">
          <button 
            onClick={retryWhatsApp}
            className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            ¿No se abrió WhatsApp? Clic aquí para enviar comprobante
          </button>
          
          <Link 
            to="/"
            className="w-full bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-300 font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5" /> Volver a la Tienda
          </Link>
        </div>

      </div>
    </div>
  );
};
