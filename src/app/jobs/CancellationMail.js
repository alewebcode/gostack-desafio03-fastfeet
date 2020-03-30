import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { order } = data;

    await Mail.sendMail({
      to: `${order.deliveryman.name} <${order.deliveryman.email}>`,
      subject: 'Cancelamento de entrega',
      template: 'cancellation',
      context: {
        product: order.product,
        deliveryman: order.deliveryman.name,
        recipient: order.recipient.name,
        recipient_address: `${order.recipient.street},${order.recipient.city} - ${order.recipient.state} - ${order.recipient.zip_code}`,
      },
    });
  }
}

export default new CancellationMail();
