import * as Yup from 'yup';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOderMail';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class OrderController {
  async index(req, res) {
    const { filter = '' } = req.query;

    const orders = await Order.findAll({
      where: {
        product: { [Op.like]: `%${filter}%` },
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'city', 'state'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const validation = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(401).json('validations fails');
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    const recipient = await Recipient.findByPk(recipient_id);

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    await Queue.add(NewOrderMail.key, { deliveryman, recipient, product });

    return res.json(order);
  }

  async update(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      res.status(400).json({ error: 'Order not exists' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      res.status(400).json({ error: 'Order not exists' });
    }
    await order.destroy();

    return res.send();
  }
}

export default new OrderController();
