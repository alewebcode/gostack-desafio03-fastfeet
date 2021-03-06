module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER,
        references: { model: 'recipients', id: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      deliveryman_id: {
        type: Sequelize.INTEGER,
        references: { model: 'deliverymans', id: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      signature_id: {
        type: Sequelize.INTEGER,
        references: { model: 'files', id: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('orders');
  },
};
