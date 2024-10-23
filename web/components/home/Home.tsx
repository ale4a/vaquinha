// import Image from 'next/image';
// import Link from 'next/link';
// import React from 'react';

// const Home = () => {
//   return (
//     <div className="w-full h-full flex flex-col justify-between">
//       {/* Navbar */}
//       <div className="flex flex-wrap h-20 justify-between items-center">
//         <Link className="flex gap-0.5" href={'/'}>
//           <Image src="/favicon.ico" alt="Logo" width={30} height={30} />
//           <span className="font-medium text-xl">VAQUITA</span>
//         </Link>
//         <div className="flex-none space-x-1 flex wallets-buttons">
//           {/* Aquí iría el componente de botón de conexión a la wallet */}
//           <button className="bg-green-500 text-white px-4 py-2 rounded">
//             Connect Wallet
//           </button>
//         </div>
//       </div>

//       {/* Hero Section */}
//       <div className="flex flex-col items-center justify-center grow mt-10">
//         <h1 className="text-4xl font-bold text-center mb-4">
//           Save Together, Earn More
//         </h1>
//         <p className="text-lg text-center mb-6">
//           Join a community savings protocol powered by blockchain technology.
//           Contribute to a shared pool and earn bigger rewards the longer you
//           stay.
//         </p>
//         <button className="bg-green-500 text-white py-2 px-6 rounded-full mb-10">
//           Get Started
//         </button>

//         {/* Main Image */}
//         <div className="w-full flex justify-center">
//           <Image
//             src="/Saving money-amico.svg"
//             alt="Saving money"
//             width={500}
//             height={500}
//             className="max-w-full h-auto"
//           />
//         </div>
//       </div>

//       {/* Benefits Section */}
//       <div className="flex flex-col items-center mt-12 mb-12">
//         <h2 className="text-2xl font-bold mb-6">Why Choose Us?</h2>
//         <ul className="space-y-4 text-center max-w-md">
//           <li>
//             <strong>Secure and Transparent Saving:</strong> All transactions are
//             verified on the blockchain.
//           </li>
//           <li>
//             <strong>Rewards for Patience:</strong> The longer you wait, the
//             bigger the reward from the shared pool.
//           </li>
//           <li>
//             <strong>Inspired by Tradition:</strong> A time-tested savings model,
//             now enhanced by blockchain technology.
//           </li>
//           <li>
//             <strong>Game-Theory Incentives:</strong> Stay till the end and enjoy
//             extra interest benefits.
//           </li>
//         </ul>
//       </div>

//       {/* Footer */}
//       <footer className="w-full py-6 flex justify-center items-center bg-gray-100">
//         <p className="text-sm text-gray-500">
//           © 2024 VAQUITA. All rights reserved.
//         </p>
//       </footer>
//     </div>
//   );
// };

// export default Home;

import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import TeamSection from './TeamSection';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="flex flex-col bg-bg-100">
      <Header />
      <HeroSection />
      <HowItWorks />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Home;
