import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scale, Menu, X, LogOut, User, FileText, Shield, Bell } from 'lucide-react';
import WalletConnectButton from '../shared/WalletConnectButton';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={closeMenus}>
              <Scale className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-semibold text-primary-500">LegalVerify</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link 
                to="/dashboard" 
                className={`${
                  location.pathname === '/dashboard' 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-primary-500'
                } px-1 pt-1 font-medium transition-colors duration-200`}
              >
                Dashboard
              </Link>
              <Link 
                to="/reviews" 
                className={`${
                  location.pathname.startsWith('/reviews') 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-primary-500'
                } px-1 pt-1 font-medium transition-colors duration-200`}
              >
                Reviews
              </Link>
              <Link 
                to="/verification" 
                className={`${
                  location.pathname.startsWith('/verification') 
                    ? 'text-primary-500 border-b-2 border-primary-500' 
                    : 'text-gray-500 hover:text-primary-500'
                } px-1 pt-1 font-medium transition-colors duration-200`}
              >
                Verification
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Wallet Connect Button */}
            <WalletConnectButton size="sm" />
            
            {isAuthenticated ? (
              <>
                {/* Notification button */}
                <button 
                  className="p-2 rounded-full text-gray-500 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                </button>
                
                {/* Profile dropdown */}
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={toggleProfile}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                      id="user-menu"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      {user?.avatarUrl ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.avatarUrl}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </button>
                  </div>
                  
                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-1" role="none">
                        <div className="px-4 py-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="py-1" role="none">
                        <Link
                          to="/profile"
                          className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <User className="mr-3 h-5 w-5 text-gray-500" />
                          Profile
                        </Link>
                        <Link
                          to="/my-reviews"
                          className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <FileText className="mr-3 h-5 w-5 text-gray-500" />
                          My Reviews
                        </Link>
                        <Link
                          to="/wallet"
                          className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={closeMenus}
                        >
                          <Shield className="mr-3 h-5 w-5 text-gray-500" />
                          Wallet
                        </Link>
                      </div>
                      <div className="py-1" role="none">
                        <button
                          onClick={() => {
                            logout();
                            closeMenus();
                          }}
                          className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`${
                location.pathname === '/dashboard'
                  ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200`}
              onClick={closeMenus}
            >
              Dashboard
            </Link>
            <Link
              to="/reviews"
              className={`${
                location.pathname.startsWith('/reviews')
                  ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200`}
              onClick={closeMenus}
            >
              Reviews
            </Link>
            <Link
              to="/verification"
              className={`${
                location.pathname.startsWith('/verification')
                  ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                  : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200`}
              onClick={closeMenus}
            >
              Verification
            </Link>
          </div>
          
          {/* Wallet section in mobile menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <WalletConnectButton size="sm" />
            </div>
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {user?.avatarUrl ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatarUrl}
                    alt={user.name}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  Profile
                </Link>
                <Link
                  to="/my-reviews"
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  My Reviews
                </Link>
                <Link
                  to="/wallet"
                  className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  Wallet
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenus();
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col px-4 space-y-2">
              <Link
                to="/login"
                className="w-full px-4 py-2 text-center text-sm font-medium text-primary-500 bg-white border border-primary-500 rounded-md hover:bg-primary-50 transition-colors duration-200"
                onClick={closeMenus}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-2 text-center text-sm font-medium text-white bg-primary-500 border border-transparent rounded-md shadow-sm hover:bg-primary-600 transition-colors duration-200"
                onClick={closeMenus}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;