import { Image } from '@nextui-org/react';

const teamMembers = [
  {
    name: 'Alejandro Alvarez',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/alejandro.png',
  },
  {
    name: 'Oscar Gauss',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/gauss.png',
  },
  {
    name: 'Fabio Laura',
    role: '+5 years Fullstack Dev',
    imgSrc: '/team/fabio.png',
  },
  {
    name: 'Leandro Conti',
    role: 'Product and MKT, 3 times founder',
    imgSrc: '/team/leandro.png',
  },
];

const TeamSection = () => {
  return (
    <section className="mt-12 text-center px-4">
      <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member) => (
          <div key={member.name} className="flex flex-col items-center">
            <div className="relative">
              {/* Sombra personalizada */}
              <div className="absolute inset-0 bg-bg-200 rounded-full filter blur-lg opacity-50"></div>
              <Image
                isBlurred
                width={150}
                alt={member.name}
                src={member.imgSrc}
                className="m-4"
                radius="full"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
