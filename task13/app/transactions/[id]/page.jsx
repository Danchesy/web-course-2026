import TransactionDetailsController from '../../../src/controllers/TransactionDetailsController';

export default async function TransactionDetailsPage({ params }) {
  const { id } = await params;
  return <TransactionDetailsController id={id} />;
}
