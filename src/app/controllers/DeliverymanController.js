import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { filter = '' } = req.query;

    const deliverymans = await Deliveryman.findAll({
      attributes: ['name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      where: {
        name: { [Op.like]: `%${filter}%` },
      },
    });

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.date().required(),
      avatar_id: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { name, avatar_id, email } = req.body;

    if (!req.userId) {
      res.status(400).json({ error: 'User dont have permission' });
    }

    const deliveryman = await Deliveryman.create({
      name,
      avatar_id,
      email,
    });

    return res.json(deliveryman);
  }

  async update(req, res) {
    const { email } = req.body;

    if (!req.userId) {
      return res.status(400).json({ error: 'User dont have permission' });
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    if (email && email !== deliveryman.email) {
      const email_exists = await Deliveryman.findOne({ where: { email } });

      if (email_exists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    await deliveryman.update(req.body);

    return res.json(deliveryman);
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(400).json({ error: 'User dont have permission' });
    }

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not exists' });
    }

    await deliveryman.destroy();

    return res.send();
  }
}

export default new DeliverymanController();
