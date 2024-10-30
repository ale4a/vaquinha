import { Image } from '@nextui-org/react';
import Link from 'next/link';
import { FaLinkedin } from 'react-icons/fa'; // Importa el icono de LinkedIn

const teamMembers = [
  {
    name: 'Fabio Laura',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/fabio.png',
    linkedinUrl: 'https://www.linkedin.com/in/fabio-laura-yavi-414b95111/',
    description:
      'Fabio is passionate about web3, with experience in Rust and Solidity for smart contract development.',
  },
  {
    name: 'Alejandro Alvarez',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/alejandro.png',
    linkedinUrl: 'https://www.linkedin.com/in/ale4a/',
    description:
      'Alejandro is a fullstack developer with a deep focus on blockchain technology and decentralized applications.',
  },

  {
    name: 'Leandro Conti',
    role: 'Product and MKT, 3 times founder',
    imgSrc: '/team/leandro.png',
    linkedinUrl: 'https://www.linkedin.com/in/contilea/',
    description:
      'Leandro is a seasoned entrepreneur, having founded multiple successful startups with a focus on product marketing.',
  },
  {
    name: 'Oscar Gauss',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/gauss.png',
    linkedinUrl: 'https://www.linkedin.com/in/oscargauss/',
    description:
      'Oscar specializes in backend development and has a strong background in building scalable systems.',
  },
];

const TeamSection = () => {
  return (
    <section className="mt-12 text-center px-4">
      <h2 className="text-3xl font-bold mb-12 lg:mb-20">Core Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-screen-xl mx-auto">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex flex-col items-center">
            <div className="relative mb-6">
              <Image
                isBlurred
                width={150}
                alt={member.name}
                src={member.imgSrc}
                radius="full"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
            <p className="text-sm font-light text-accent-200 mt-2">
              {member.role}
            </p>
            <p className="mt-4 text-sm max-w-xs text-gray-400">
              {member.description}
            </p>

            {/* Enlace de LinkedIn con el icono */}
            <Link
              href={member.linkedinUrl}
              passHref
              className="flex items-center text-blue-500 hover:underline mt-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="mr-2" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
