import React, { ReactNode } from 'react';

const Navbar = ({ links }: { links: { label: string; path: string }[] }) => {
  return (
    <div className="bg-bg-100">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias iusto,
      molestiae velit suscipit incidunt quaerat laboriosam facilis saepe
      possimus minus optio, at ipsam aut, eius itaque qui maiores quo tenetur.
      <p className="font-bold">abc</p>
      <p className="font-light">xsz</p>
      <p className="font-semibold">xsz</p>
    </div>
  );
};

export default Navbar;
