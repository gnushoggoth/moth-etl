const {
  upsertEntity,
  createDelta,
  getDeltasForEntity,
  getCurrentStateOfEntity
} = require('./hypergraphDAL');

async function main() {
  try {
    await upsertEntity('mu', 'user', { name: 'mu' });
    await upsertEntity('epsilon', 'user', { name: 'epsilon' });
    await upsertEntity('moth', 'user', { name: 'moth' });

    await createDelta('friend', 'epsilon', ['social'], {
      friendId: 'moth'
    });

    await createDelta('deposit', 'mu', ['financial'], {
      amount: 10000,
      currency: 'UD'
    });

    const muDeltas = await getDeltasForEntity('mu');
    console.log('Deltas for mu:', muDeltas);

    const muFinalState = await getCurrentStateOfEntity('mu');
    console.log('Final state of mu:', muFinalState);

    const epsilonFinalState = await getCurrentStateOfEntity('epsilon');
    console.log('Final state of epsilon:', epsilonFinalState);
  } catch (err) {
    console.error('Error in main():', err);
  } finally {
    // In a real project, you might keep the process open or
    // do more tasks. For quick testing, let's exit.
    process.exit(0);
  }
}

main();
