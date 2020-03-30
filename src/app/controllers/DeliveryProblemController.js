import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class DeliveryProblemController {
  async index(req, res) {
    const order_id = req.params.id;

    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: order_id },
      attributes: ['delivery_id', 'description'],
      include: [
        {
          model: Order,
          atributes: ['product'],
        },
      ],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.integer().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid())) {
      return res.status(401).json('validations fails');
    }
    const { order_id, description } = req.body;

    const order = await Order.findByPk(order_id);

    if (!order) {
      res.status(400).json({ error: 'Order not found' });
    }

    const delivery_problem = await DeliveryProblem.create({
      delivery_id: order_id,
      description,
    });

    return res.json(delivery_problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    const canceled_at = new Date();

    const order = await Order.findOne({
      where: { id: problem.delivery_id, end_date: null, canceled_at: null },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'city', 'state', 'zip_code'],
        },
      ],
    });
    if (!order) {
      return res
        .status(400)
        .json({ error: 'Order already canceled or finished' });
    }

    const canceled = await order.update({ canceled_at });

    await Queue.add(CancellationMail.key, { order });

    return res.json(canceled);
  }
}

export default new DeliveryProblemController();
