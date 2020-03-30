module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('recipients', 'created_at', {
        type: Sequelize.DATE,
      }),
      queryInterface.addColumn('recipients', 'updated_at', {
        type: Sequelize.DATE,
      }),
    ]);
  },

  down: queryInterface => {
    return queryInterface.removeColumn('created_at', 'updated_at');
  },
};
