import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
// import DeliverymanDeliveriesController from './app/controllers/DeliverymanDeliveriesController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveries/:id', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);

routes.post('/deliveryproblems', DeliveryProblemController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);
routes.get('/recipients', RecipientController.index);

routes.post('/deliverymans', CourierController.store);
routes.put('/deliverymans/:id', CourierController.update);
routes.delete('/deliverymans/:id', CourierController.delete);
routes.get('/deliverymans', CourierController.index);

routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);
routes.get('/orders', OrderController.index);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveryproblems/:id', DeliveryProblemController.index);
routes.delete('/deliveryproblems/:id', DeliveryProblemController.delete);

export default routes;
