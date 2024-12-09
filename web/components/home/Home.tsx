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
      {/* <TeamSection /> */}
      <Footer />
    </div>
  );
};

export default Home;
