import Image from 'next/image';
import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-12 text-center">
      <h2 className="text-3xl font-bold mb-8">How It Works</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center md:col-span-2  shadow-lg rounded-lg gap-10">
          <Image
            src="/01-Mobile UX-rafiki.svg"
            alt="creating a group"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
          <div className="md:ml-6 max-w-md">
            <h3 className="text-xl font-semibold">Step 1: Create a Group</h3>
            <p className="mt-2">
              Start by creating a group. Set the collateral in USDC, the
              duration, and the number of participants.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center justify-center md:col-span-2  shadow-lg rounded-lg gap-10">
          <Image
            src="/02-Good team-bro.svg"
            alt="join to the group"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
          <div className="md:mr-6 max-w-md">
            <h3 className="text-xl font-semibold">Step 2: Join the Group</h3>
            <p className="mt-2">
              Other people join the group by contributing their equivalent
              collateral.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:col-span-2  shadow-lg rounded-lg gap-10">
          <Image
            src="/03-Online transactions-pana.svg"
            alt="Pay vaquita"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
          <div className="md:ml-6 max-w-md">
            <h3 className="text-xl font-semibold">
              Step 3: Make Contributions
            </h3>
            <p className="mt-2">
              Each member contributes at the set times. The contributions go
              into a common pool.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center justify-center md:col-span-2  shadow-lg rounded-lg gap-10">
          <Image
            src="/04-Selecting team-pana.svg"
            alt="Random draw"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
          <div className="md:mr-6 max-w-md">
            <h3 className="text-xl font-semibold">Step 4: Random Draw</h3>
            <p className="mt-2">
              Each month, one member is randomly chosen to receive the total
              pooled amount.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center md:col-span-2  shadow-lg rounded-lg gap-10">
          <Image
            src="/05-Finance app-pana.svg"
            alt="Collateral return"
            width={500}
            height={500}
            className="max-w-full h-auto"
          />
          <div className="md:ml-6 max-w-md">
            <h3 className="text-xl font-semibold">Step 5: Collateral Return</h3>
            <p className="mt-2">
              At the end of the cycle, collateral and the interest earned are
              returned to each participant.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
