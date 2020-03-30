module.exports = {
  up: queryInterface => {
    return queryInterface.addConstraint('deliverymans', ['avatar_id'], {
      type: 'foreign key',
      references: {
        table: 'files',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: queryInterface => {
    return queryInterface.removeConstraint('deliveryman', 'avatar_id');
  },
};
