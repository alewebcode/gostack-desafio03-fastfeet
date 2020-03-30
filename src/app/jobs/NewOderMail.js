import Mail from '../../lib/Mail';

class NewOrderMail {
  get key() {
    return 'NewOrderMail';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;
    console.log(deliveryman);
    console.log(recipient);
    console.log(product);
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Novo cadastro de encomenda',
      template: 'order',
      context: {
        product,
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        recipient_address: `${recipient.street},${recipient.city} - ${recipient.state} - ${recipient.zip_code}`,
      },
    });
  }
}

export default new NewOrderMail();
