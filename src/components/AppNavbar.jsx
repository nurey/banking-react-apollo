import React from 'react';
import { Navbar, NavbarBrand } from 'flowbite-react';
import { useAuth } from '../hooks/useAuth';

const AppNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar fluid className="bg-ledger-surface! border-b border-ledger-border">
      <NavbarBrand href="/">
        <span className="text-ledger-amber text-lg mr-2">&#9670;</span>
        <span className="self-center text-xl font-semibold tracking-tight text-ledger-text-primary">
          Budgetr
        </span>
      </NavbarBrand>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-ledger-text-2">{user.email_address}</span>
          <button
            onClick={logout}
            className="text-sm text-ledger-text-2 hover:text-ledger-text-1"
          >
            Sign out
          </button>
        </div>
      )}
    </Navbar>
  );
};

export default AppNavbar;
