'use client';

/**
 * Login Page (Root Page)
 * Displays login form or redirects to dashboard if authenticated
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { pageFadeIn } from '../utils/animations';

export default function HomePage() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (session?.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [session, router]);

  /**
   * Show loading spinner during initial auth check
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  /**
   * Don't render login form if redirecting
   */
  if (session?.isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      variants={pageFadeIn}
      initial="hidden"
      animate="visible"
    >
      <LoginForm />
    </motion.div>
  );
}
