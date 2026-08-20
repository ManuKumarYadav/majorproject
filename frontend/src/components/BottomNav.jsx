import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, LayoutDashboard, User, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link 
        to="/" 
        className={`bottom-nav-item ${isActive('/') || isActive('/listings') ? 'active' : ''}`}
      >
        <Search size={22} />
        <span>Explore</span>
      </Link>

      <Link 
        to="/?wishlist=true" 
        className={`bottom-nav-item ${location.search.includes('wishlist') ? 'active' : ''}`}
      >
        <Heart size={22} />
        <span>Wishlists</span>
      </Link>

      <Link 
        to={user ? "/host/dashboard" : "/login"} 
        className={`bottom-nav-item ${isActive('/host/dashboard') ? 'active' : ''}`}
      >
        <LayoutDashboard size={22} />
        <span>Hosting</span>
      </Link>

      <Link 
        to={user ? "/profile/edit" : "/login"} 
        className={`bottom-nav-item ${isActive('/profile/edit') || isActive('/login') || isActive('/signup') ? 'active' : ''}`}
      >
        {user ? <User size={22} /> : <LogIn size={22} />}
        <span>{user ? 'Profile' : 'Log In'}</span>
      </Link>
    </nav>
  );
}
