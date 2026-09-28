import type { OrderPayload } from '../types';

const WHATSAPP_NUMBER = '573001234567'; // Configurable

export function generateWhatsAppUrl(orderData: OrderPayload): string {
  const itemsText = orderData.items
    .map((item) => `• ${item.cantidad}x ${item.nombre} - $${(item.precio * item.cantidad).toLocaleString('es-CO')}`)
    .join('\n');

  const message = `¡Hola! Quiero confirmar mi compra en la tienda web ⚡

*Pedido:* #${orderData.codigoPedido}
*Fecha:* ${orderData.fecha}

*Resumen de Productos:*
${itemsText}

*Subtotal:* $${orderData.subtotal.toLocaleString('es-CO')}
*Envío:* $${orderData.costoEnvio.toLocaleString('es-CO')}
*TOTAL A TRANSFERIR:* $${orderData.total.toLocaleString('es-CO')}

*Datos de Entrega:*
- *Nombre:* ${orderData.nombre}
- *Celular:* ${orderData.telefono}
- *Dirección:* ${orderData.direccion}
- *Ciudad/Municipio:* ${orderData.ciudad}
- *Notas:* ${orderData.notas || 'Ninguna'}

*Método de Pago Seleccionado:* ${orderData.metodoPago === 'nequi' ? 'Nequi' : 'Transferencia Bancaria (Bancolombia)'}

Adjunto a continuación el comprobante de la transferencia. ¡Quedo atento a la confirmación!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
