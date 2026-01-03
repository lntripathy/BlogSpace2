import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-3">
        
        {/* Brand / Info */}
        <div>
          <Link to="/" className="flex gap-3 items-center">
            <img src={Logo} alt="BlogSpace Logo" className="invert w-12 h-12" />
            <h1 className="text-3xl font-bold">BlogSpace</h1>
          </Link>

          <p className="mt-3 text-sm text-gray-400">
            Sharing insights, tutorials, and ideas on web development & tech.
          </p>

          <div className="mt-3 text-sm text-gray-400 space-y-1">
            <p>📍 India</p>
            <p>📧 support@blogspace.com</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-red-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-red-500 transition">
                Blogs
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-red-500 transition">
                Search Blogs
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-red-500 transition">
                My Profile
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-red-500 transition">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold">Follow Us</h3>
          <div className="flex gap-4 mt-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition"
            >
              <FaTwitterSquare />
            </a>
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition"
            >
              <FaPinterest />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="text-red-500 font-semibold">BlogSpace</span>.  
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
