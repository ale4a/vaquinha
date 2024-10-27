import { motion } from 'framer-motion';

export const DashboardActiveIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        animate={{ fill: '#F5F5F5' }}
        initial={{ fill: '#B5B5B5' }}
        transition={{ duration: 0.5 }}
        d="M0 10.6667H10.6667V0H0V10.6667ZM2.66667 2.66667H8V8H2.66667V2.66667ZM13.3333 0V10.6667H24V0H13.3333ZM21.3333 8H16V2.66667H21.3333V8ZM0 24H10.6667V13.3333H0V24ZM2.66667 16H8V21.3333H2.66667V16Z"
        fill="#F5F5F5"
      />
      <motion.path
        animate={{ fill: '#FFA109' }}
        initial={{ fill: '#929292' }}
        transition={{ duration: 0.5 }}
        d="M17 13H19.6667V17H23.6667V19.6667H19.6667V23.6667H17V19.6667H13V17H17V13Z"
        fill="#FFA109"
      />
    </svg>
  );
};
