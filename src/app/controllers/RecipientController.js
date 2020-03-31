import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { filter = '' } = req.query;

    const recipients = await Recipient.findAll({
      where: {
        name: { [Op.like]: `%${filter}%` },
      },
    });

    return res.json(recipients);
  }

  async store(req, res) {
    const validation = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zip_code: Yup.string().required(),
    });

    if (!(await validation.isValid(req.body))) {
      return res.status(401).json('validations fails');
    }
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res) {
    if (!req.userId) {
      return res.status(400).json({ error: 'User dont have permission' });
    }

    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not exists' });
    }

    await recipient.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
