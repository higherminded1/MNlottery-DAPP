import React from 'react'
import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ArrowUturnDownIcon,
} from "@heroicons/react/24/solid"
import { 
  useContract, 
  useContractWrite, 
  useContractRead
} from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { currency } from '../constants';
import toast from 'react-hot-toast';
import Loading from './Loading';


function AdminControls() {
  const { contract } = useContract( process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS );
  const {data: totalCommission } = useContractRead(
    contract, 
    "operatorTotalCommission"
  );
  
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract, 
    "DrawWinnerTicket"
  );

  const { mutateAsync: RefundAll } = useContractWrite(
    contract, 
    "RefundAll"
  );

  const { mutateAsync: restartDraw } = useContractWrite(
    contract, 
    "restartDraw"
  );

  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract, 
    "WithdrawCommission"
  );

  const onWithdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commission...");

    try {
      const data = await WithdrawCommission([{}]);

      toast.success("Commission withdraw successful!", {
        id: notification,
      });
      console.info("contract call success", data);
    }catch (err) {
      toast.error("Whoops something went wrong!!", {
        id: notification
      });

      console.error("contract call failure", err);
    }
  };

  const onDrawWinner = async () => {
    const notification = toast.loading("Picking a Lucky Winner...");

    try {
      const data = await DrawWinnerTicket([{}]);

      toast.success("A Winner has been selected!", {
        id: notification,
      });
      console.info("contract call success", data);
    }catch (err) {
      toast.error("No players to draw from!!", {
        id: notification
      });
      console.error("contract call failure", err);
    }
  };

  const onReastartDraw = async () => {
    const notification = toast.loading("Starting  a draw...");

    try {
      const data = await restartDraw([{}]);

      toast.success("Draw restart successful!", {
        id: notification,
      });
      console.info("contract call success", data);
    }catch (err) {
      toast.error("Whoops something went wrong!!", {
        id: notification
      });
      console.error("contract call failure", err);
    }
  };

  const onRefundAll = async () => {
    const notification = toast.loading("Refunding all players...");

    try {
      const data = await RefundAll([{}]);

      toast.success("All refunded successfull!", {
        id: notification,
      });
      console.info("contract call success", data);
    }catch (err) {
      toast.error("Whoops something went wrong!!", {
        id: notification
      });
      console.error("contract call failure", err);
    }
  };

  return (
    <div className='text-[#000000] bg-[#13faaa] text-center px-5 py-3 rounded-md border-[#000000] border shadow-xl '>
      <h2 className='font-bold'>Admin Controls</h2>
      <p className='mb-5 '>
        Total Commission to be Withdrawn:{
          totalCommission &&
            ethers.utils.formatEther(totalCommission?.toString())
        }
      {currency}
      </p>

      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 justify-evenly'>
        <button onClick={onDrawWinner} className=' admin-button bg-[#b030ff] flex-1 justify-evenly border border-[#000000] shadow-xl rounded-xl hover:bg-[#13ffff]'>
          <StarIcon className='h-6 mx-auto mb-2' />
          Draw Winner</button>
        <button onClick={onWithdrawCommission} className=' admin-button bg-[#b030ff] flex-1 justify-evenly border border-[#000000] shadow-xl rounded-xl hover:bg-[#13ffff]'>
        <CurrencyDollarIcon className='h-6 mx-auto mb-1 mt-1' />
        WithDraw Commission</button>
        <button onClick={onReastartDraw} className=' admin-button bg-[#b030ff] flex-1 justify-evenly border border-[#000000] shadow-xl rounded-xl hover:bg-[#13ffff]'>
        <ArrowPathIcon className='h-6 mx-auto mb-2' />
          Restart Draw</button>
        <button onClick={onRefundAll} className=' admin-button bg-[#b030ff] flex-1 justify-evenly border border-[#000000] shadow-xl rounded-xl hover:bg-[#13ffff]'>
        <ArrowUturnDownIcon className='h-6 mx-auto mb-2 mt-2' />
          Refund All after round ONLY</button>

    </div>
  </div>
  );
};

export default AdminControls;