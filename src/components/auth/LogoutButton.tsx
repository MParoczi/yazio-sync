'use client';

/**
 * LogoutButton Component
 * Provides a button to log out the current user
 */

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

interface LogoutButtonProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * LogoutButton Component
 * Renders a glassmorphism-styled button that logs out the user
 */
export function LogoutButton({ className = '', showIcon = true }: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={`glass-button text-white font-medium flex items-center gap-2 ${className}`}
      aria-label="Log out"
    >
      {showIcon && <ArrowRightOnRectangleIcon className="w-5 h-5" />}
      <span>Log Out</span>
    </button>
  );
}
