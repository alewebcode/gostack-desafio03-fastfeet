import * as Yup from 'yup';
import {
  startOfHour,
  parseISO,
  setHours,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    const deliveryman_id = req.params.id;
    const { deliveried } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id,
        end_date: deliveried === 'true' ? { [Op.not]: null } : null,
        canceled_at: null,
      },
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { order_id, start_date, deliveryman_id } = req.body;

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(400).json({ error: 'order not found!' });
    }

    const checkOrder = await Order.findOne({
      where: { start_date: null, end_date: null, canceled_at: null },
    });

    if (!checkOrder) {
      return res.status(400).json({ error: 'order started or finished!' });
    }

    const hourStart = startOfHour(parseISO(start_date));
    const currentDate = new Date();

    const validHours = isWithinInterval(hourStart, {
      start: startOfHour(setHours(hourStart, 8)),
      end: startOfHour(setHours(hourStart, 18)),
    });

    if (!validHours) {
      return res.status(400).json({
        error: 'You can only withdraw the deliveries between 08:00h and 18:00h',
      });
    }

    const checkDeliveries = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(currentDate), endOfDay(currentDate)],
        },
      },
    });

    if (checkDeliveries.length > 5) {
      return res.status(400).json({
        error: 'Limit has been exceeded!',
      });
    }

    await order.update(req.body);

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      end_date: Yup.date().required(),
      signature_id: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { end_date, signature_id } = req.body;

    const order = await Order.findByPk(req.params.id);

    const date_finished = startOfHour(parseISO(end_date));

    if (!order) {
      res.status(400).json({ error: 'order not exists!' });
    }

    const delivery_finished = await Order.findOne({
      where: {
        end_date: null,
        canceled_at: null,
        start_date: { [Op.not]: null },
      },
    });

    delivery_finished.update({
      end_date: date_finished,
      signature_id,
    });

    return res.json(order);
  }
}
export default new DeliveryController();
