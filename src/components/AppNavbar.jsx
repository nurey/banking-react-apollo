import React from 'react';
import { Navbar, NavbarBrand } from 'flowbite-react';

const AppNavbar = () => {
  return (
    <Navbar fluid className="!bg-ledger-surface border-b border-ledger-border">
      <NavbarBrand href="/">
        <span className="text-ledger-amber text-lg mr-2">&#9670;</span>
        <span className="self-center text-xl font-semibold tracking-tight text-ledger-text-primary">
          Budgetr
        </span>
      </NavbarBrand>
    </Navbar>
  );
};

export default AppNavbar;
