import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header';
import { useContract ,
  useAddress,
  useContractRead,
  useContractWrite
 } from '@thirdweb-dev/react';
import Login from '../components/Login';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { currency } from '../constants';
import CountDownTimer from '../components/CountDownTimer';
import { toast } from 'react-hot-toast';
import Marquee from "react-fast-marquee";
import AdminControls from '../components/AdminControls';
import { ArrowPathIcon, StarIcon } from "@heroicons/react/24/solid";
import { ethers } from 'ethers';

const Home: NextPage = () => {
  const address = useAddress();
  const { contract } = useContract( process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS );
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);
  const { ethers } = require("ethers");
  const { data: expiration } = useContractRead(contract, "expiration");
  const { isLoading } = useContractRead(contract, "CurrentWinningReward");
  const { data: remainingTickets } = useContractRead(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice");
  const { data: ticketCommission } = useContractRead(contract, "ticketCommission");
  const { data: tickets } = useContractRead(contract, "getTickets");
  const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw");
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(contract, "DrawWinnerTicket");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const { data: winnings } = useContractRead(contract, "getWinningsForAddress", address);
  const { mutateAsync: WithdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount");
  const { data: isLotteryOperator } = useContractRead(contract, "lotteryOperator");

  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );

    setUserTickets(noOfUserTickets);

  }, [tickets, address]);

  //construct handle onClick buy ticket button
  const handelClick = async () => {
    if (!ticketPrice) return;

    const notification = toast.loading("Buying your tickets traveler...")
    try {
      const data = await BuyTickets(
        [
          {
            value: ethers.utils.parseEther(
              (
                Number(ethers.utils.formatEther(ticketPrice)) * quantity
              ).toString()
            ),
          },
        ]
      );

      toast.success("Tickets purchased successfully traveler!", {
        id: notification,
      });

      console.info("contract call successs", data);
    }
     catch (err) {
      console.error("contract call failure", err);
    }
  };

  // Restart a Draw
  const onReastartDraw = async () => {
    const notification = toast.loading("Restarting draw...");

    try {
      const data = await restartDraw([{}]);

      toast.success("Draw restart successful!", {
        id: notification,
      });
      console.info("contract call success", data);
    }catch (err) {
      toast.error("Restart olny after round end!!", {
        id: notification
      });
      console.error("contract call failure", err);
    }
  };

  // draw a WINNER
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

//Winner Withdraw Button notifications showing winnings & restarting drawing
  const onWithdrawWinnings = async() => {
    const notification = toast.loading("Withdrawing winnings traveler...");

    try {
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully traveler!", {
        id: notification,
      });

    } catch (err) {
      toast.error("Whoops! Something went wrong traveler...", {
        id: notification,
      });

      console.error("contract call failure", err);
    }
  }

  // from login to loading to draw page
  if (!address) return <Login />;
  if (isLoading) return <Loading />;

  //header

  return (
    <div className="bg-[#13ffff] min-h-screen flex flex-col">
      <Head>
        <title>Mint Nebula Raffle Lottery</title>
      </Head>

      {/* Streaming Marquee display last draw winner */}
      <div className='flex-1'>

        <Header />
        <Marquee className="bg-[#13faaa] p-5 mb-5 shadow-xl " gradient={false} speed={100}>
          <div className='flex space-x-2 mx-10'>
            <h4 className='text-[#000000] font-bold '>Last Winning Traveler: {lastWinner?.toString()}</h4>
            <h4 className='text-[#000000] font-bold '> Won a prize of: {
            lastWinnerAmount && 
              ethers.utils.formatEther(lastWinnerAmount?.toString())
            }{currency}</h4>
          </div>
        </Marquee>

        {/* Admin Controls buttons */}

        {isLotteryOperator === address && (
          <div className='flex justify-evenly '>
            <AdminControls />
          </div>
        )}

        {/* When a Winner is Drawn a box will Prompt them to redeem below the marquee */}

        {winnings > 0 &&(
          <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5 shadow-xl'>
            <button onClick={onWithdrawWinnings} className='p-5 bg-gradient-to-br from-[#13faaa] to-[#b030ff] text-center rounded-xl w-full animate-pulse shadow-xl'>
              <p className='font-bold'>
                The Nebula has has formed a WINNER!
              </p>
              <p className='font-bold text-xl text-[#be19a8]'>
              You are the WINNER! Congratulations traveler!
              </p>
              <br />
              <p className='italic'>
                Total Winnings: {ethers.utils.formatEther(winnings.toString())}
                {currency}
              </p>
              <br />
              <p className='font-semibold'>
                Click here to withdraw!
              </p>

            </button>
          </div>

        )};

        {/* User front end control buttons */}
        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-evenly md:space-x-5 flex-2 '>
          <div className='text-[#000000] text-center justify-center flex-row px-5 py-3 '>
          <button onClick={onReastartDraw} className=' admin-button shadow-xl bg-[#13faaa] rounded-xl border border-[#000000] px-4 py-2 hover:bg-[#b030ff]'>
          <ArrowPathIcon className='h-6 mx-auto mb-2 ' />
            Start a Draw</button>
          </div>

          <div className='text-[#000000] text-center justify-between flex-row  px-5 py-3'>
            <button onClick={onDrawWinner} className=' admin-button shadow-xl bg-[#13faaa] rounded-xl border border-[#000000] px-4 py-2 hover:bg-[#b030ff]'>
              <StarIcon className='h-6 mx-auto mb-2' />
              Draw A Winner
            </button>
          </div>
        </div>

        {/* the Next Draw Box Pool Total box */}
        <div className="space-y-5 md:space-y-0 m-2 md:flex md:flex-row items-start justify-center md:space-x-5 flex-1">
          <div className="stats-container shadow-xl bg-[#b030ff] border border-[#13faaa] rounded-xl px-6 py-4">
            <h1 className="text-5xl text-[#000000] font-semibold text-center justify-center">
              NEXT DRAWING
              </h1>
            <div className="flex justify-evenly p-2 space-x-2">
              <div className="stats bg-[#13faaa] rounded-lg px-2 py-2 flex-1 border border-[#000000] ">
                <h2 className="text-sm text-center">
                  TOTAL POOL
                  </h2>
                <p className="text-xl space-x-2 text-center ">{
                  currentWinningReward && ethers.utils.formatEther(
                    currentWinningReward.toString()
                  )
                }
                  {currency}
                  </p>
              </div>
              {/* Tickt count and remaining tickets box */}
              <div className="stats bg-[#13faaa] rounded-lg px-2 py-2 flex-1 border border-[#000000]">
                <h2 className="text-sm text-center">
                  Tickets Remaining
                  </h2>
                <p className="text-xl text-[#000000] text-center justify-evenly ">
                  {remainingTickets?.toNumber()} /100
                  </p>
              </div>
            </div>

            {/* Countdown timer box */}
            <div className='mt-5 mb-3 flex-automatically'>
              <CountDownTimer/>
            </div>

            {/* ticket holdings counter */}

            {userTickets > 0 && <div className='stats'>
              <p className='text-lg mb-2 justify-center text-center'>You have {userTickets} Tickets in this Draw traveler</p>
              <div className='flex max-w-full flex-wrap gap-x-2 gap-y-2 bg-[#13faaa] px-2 py-2 rounded-lg border border-[#000000]'>
                {Array(userTickets).fill("").map((_, index) => (
                  <p key={index} className="text-[#000000] h-20 w-12 bg-[#b030ff] rounded-xl flex flex-shrink-0 items-center justify-center text-xs italic border border-[#000000] animate-pulse hover:animate-bounce mt-5" 
                  >
                    {index + 1}</p>
                ))}
              </div>
            </div>}  
          </div>

          {/* Price per ticket box page right side box */}
          <div className="div.stats-container space-y-2 flex-max-sm ">
            <div className="stats-container shadow-xl bg-[#b030ff] rounded-xl py-4 px-2 flex-max-sm flex-1">
              <div className="flex justify-between items-center text-[#000000] pb-2 p-x-2">
                <h2>Price Per Ticket</h2>
                <p className='flex text-[#000000] font-bold text-lg items-center justify-center p-4'>
                  {ticketPrice && ethers.utils.formatEther(ticketPrice.toString())}
                  {currency}
                  </p>
                <p className='flex text-[#000000] italic justify-between items-center p-2 text-right'>
                  up to 10
                  </p>
              </div>

              {/*Tickets counter box */}
              <div className="flex text-[#000000] items-center space-x-2 bg-[#13faaa] border-[#000000] border p-4 rounded-xl">
                <p>TICKETS</p>
                <input 
                className="flex w-full bg-[#b030ff00] text-right outline-none" 
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              {/* Text under ticket counter box */}

              <div className='space-y-2 mt-5'>
                <div className='flex items-center justify-between text-[#13faaa] text-sm font-extrabold'>
                  <p>Total cost of tickets</p>
                  <p>
                  {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}{" "}
                  {currency}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[#000000] text-xs italic">
                  <p>Service fees</p>
                  <p>
                  {ticketCommission && ethers.utils.formatEther(ticketCommission?.toString())}
                  {currency}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-[#000000] text-xs italic">
                  <p>+ Network fees</p>
                  <p>TBC</p>
                </div>
              </div>

              {/* Buy button Dissable when draw inactive */}

              <button disabled={expiration?.toString() 
                < Date.now().toString() || remainingTickets?.toNumber() === 0
                }
                onClick={handelClick}
                className='mt-5 w-full bg-gradient-to-br from-[#13ffff] to-[#b030ff] px-10 py-5 rounded-md text-[#ffffff] shadow-xl disabled:from-[#575650] disabled:text-[#414241] disabled:to-grey-600 disabled:cursor-none border border-[#000000]'>
                Buy {quantity} tickets {ticketPrice && 
                  Number(ethers.utils.formatEther(ticketPrice.toString())) * quantity}
                {currency}
              </button>
            </div>

            {/* Directions promt on how the game works box */}

            <div className='mx-auto mt-5 p-2 max-w-lg flex flex-col pt-6'>
              <h1 className='flex flex-1 justify-center text-center text-[#000000] font-extrabold p-4 '>
              How it works: <br /> 
              </h1>
              <h2 className='flex flex-1 justify-center text-left bg-[#b030ff] rounded-lg font-semibold border-[#13faaa] border-4 shadow-xl bp-4 p-4 '>
              To start a Draw game, you can interact with the contract and launch a round. <br /> <br />
              Rounds last for two hours (2hs), or untill all the tickest have been drawn. <br /> <br />
              Users can Select a WINNER before the timer runs out if they choose. <br /> <br />
              To select a WINNER users must call the the contract by clicking draw a winner. <br /> <br />
              (Timer end will not draw a winner. Winners will ONLY be selected from ticket holders) <br /> <br />
              When a winner is selected a Round will automatically restart.
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Footer discalimer text */}

      <footer className=' border-t border-[#b030ff] flex items-center text-[#000000] justify-between border p-4'>
        <img
            className="h-10 w-10 filter opacity-60 "
            src="https://secureservercdn.net/45.40.150.54/mpp.652.myftpupload.com/wp-content/uploads/2021/11/MN512x512-60x60.png" 
            alt="" 
            />

        <p className='text-xs text-[#000000] p-2'>DISCLAIMER: This is for Fun. The content of this game is not intended to be a lure to Gambling. Instead, it is meant for nothing more then entertainment pourposes. We are NOT liable for any losses that are incurred or problems that may arise at online casinos or elsewhere. If you are utilizing this Draw game, you are doing so completly and totaly at your own risk.</p>
        
      </footer>
    </div>
  );
};

export default Home
