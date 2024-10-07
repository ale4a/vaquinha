import SavingCard from '@/components/global/SavingCard/SavingCard';
import DetailsCard from '../../components/global/DetailsCard/DetailsCard';

const page = () => {
  return <div>
    <SavingCard name={'El Pasanaku'} amount={68} collateral={341} startIn='10-10-2024' peopleCount={3} period='montly' />
    <br />
    <hr />
    <br />
    <DetailsCard members={5} interestEarned={5} period='Monthly' finalized='06-10-2024' groupId='454474792930446547' name='Pasanaku' amount={68} />
    <br />
    <br />
  </div>;
};

export default page;
