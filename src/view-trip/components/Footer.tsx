import React from "react";

const Footer = () => {
  return (
    <div className="bg-blue-50 mt-12 py-6 text-center text-sm text-gray-600 border-t w-full">
      <p>
        © {new Date().getFullYear()} All rights reserved. Created by Rajpunith.V
        .
      </p>
    </div>
  );
};

export default Footer;
