import React from 'react'
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { Contract } from 'ethers';
import Countdown from 'react-countdown';
import toast from 'react-hot-toast';

type Props = {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
};

function CountDownTimer() {
    const { contract } = useContract( process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS );
    const { data: expiration, isLoading: isLoadingExpiration } = useContractRead(
        contract,
        "expiration"
    );

    const { mutateAsync: restartDraw } = useContractWrite(
        contract, 
        "restartDraw"
    );

    const renderer = ({ hours, minutes, seconds, completed }: Props) => {
        if (completed) {
            return (
                <div className='text-[#000000] text-sm sm-2 italic'>
                    <h2 className="flex text-[#ffffff] justify-center animate-bounce">
                        Ticket Sales Have Closed for this Drawing Traveler.
                    </h2>
                </div>
            );
        } else {
            return (
                <div className='justify-evenly flex-1 '>
                    <h3 className='flex text-[#000000] text-sm mb-2 justify-center animate-bounce '>
                        Time Remaining Traveler!
                        </h3>
                        <div className="text-lg flex space-x-2 justify-evenly">
                            <div className="animate-pulse flex-1 justify-between bg-[#13faaa] justify-evenly text-center border border-[#000000] rounded-xl">
                                <div className="countdown animate-pulse mt-2  ">{hours}</div>
                                <div className="countdown-label">hours</div>
                            </div>

                            <div className="animate-pulse flex-1 justify-items-center bg-[#13faaa] justify-evenly text-center border border-[#000000] rounded-xl">
                                <div className="countdown animate-pulse mt-2  ">{minutes}</div>
                                <div className="countdown-label">minutes</div>
                            </div>

                            <div className="animate-pulse flex-1 justify-evenly bg-[#13faaa] justify-evenly text-center border border-[#000000] rounded-xl">
                                <div className="countdown animate-pulse justify-evenly mt-2 ">{seconds}</div>
                                <div className="countdown-label">seconds</div>
                            </div>
                        </div>
                </div>
            );
        }
    };

    const onReastartDraw = async () => {
        const notification = toast.loading("Restarting draw...");
    
        try {
          const data = await restartDraw([{}]);
    
          toast.success("Draw restart successful!", {
            id: notification,
          });
          console.info("contract call success", data);
        }catch (err) {
          toast.error("Whoops something went wrong traveler!!", {
            id: notification
          });
          console.error("contract call failure", err);
        }
      };

  return (
    <div>
        <Countdown date={new Date(expiration * 1000)} renderer={renderer} />
    </div>
  )
}

export default CountDownTimer