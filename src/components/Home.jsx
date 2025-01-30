import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import Logo from "../assets/health_care_logo.svg";
import experiencedTeam from "../assets/experienced-team.jpg";
import doctorpatient from "../assets/doctorpatient-image.jpg";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center py-3 bg-gradient-to-r from-green-200 to-green-400 text-black w-full">
        <img src={Logo} alt="Health Care Logo" className="h-48 mx-auto mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Health Care AB
        </h1>
        <p className="text-lg">
          Where your health and well-being are our priority. Our team of
          experienced professionals is here to provide you with the best care.
        </p>
        <div className="flex justify-center space-x-4 mt-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="primary" size="lg" className="rounded-xl bg-white hover:bg-blue-500">
                <Link to="/login">Get Started</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-100">
              <p className="text-black">Navigate to login page.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="container mx-auto my-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center w-full h-64 overflow-hidden rounded-lg shadow-md mb-4 bg-green-100">
              <img
                src={experiencedTeam}
                alt="Expert Doctor"
                className="w-auto h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold">Experienced Doctors</h3>
            <p className="text-gray-600">
              Our medical professionals bring decades of experience to ensure
              the best care for you and your family.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center w-full h-64 overflow-hidden rounded-lg shadow-md mb-4 bg-green-100">
              <img
                src={doctorpatient}
                alt="Medical Team"
                className="w-auto h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold">Comprehensive Services</h3>
            <p className="text-gray-600">
              From routine checkups to specialized treatments, we cover all
              aspects of your healthcare needs.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white py-8 w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Your Health, Our Commitment</h2>
        <p className="text-lg mb-6">
          Join our community today and experience world-class healthcare
          services that put you first.
        </p>
        <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="primary" size="lg" className="bg-white rounded-xl hover:bg-blue-500">
                <Link to="/login" className="text-black">Get Started</Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-100">
              <p className="text-black">Navigate to login page.</p>
            </TooltipContent>
          </Tooltip>
      </div>
    </div>
  );
}
