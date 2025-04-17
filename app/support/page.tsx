"use client";

import React from "react";
import { Card } from "@/components/ui/basic/card";
import Link from "next/link";
import { Linkedin, Github, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/basic/button";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  github?: string;
  linkedin?: string;
}

export default function SupportPage() {
  const router = useRouter();
  
  const teamMembers: TeamMember[] = [
    {
      name: "Antonio D. Archer", // my name is already on the blame so i might as well have fun with it
      role: "DevOps Engineer & Senior Developer",
      bio: "Leads infrastructure development and maintenance, ensuring scalable and reliable systems. also contributes to the frontend and backend development.",
      github: "https://github.com/ad-archer",
      linkedin: "https://www.linkedin.com/in/antonio-archer"
    },
    {
      name: "Bryan Gunawan", 
      role: "Head Developer",
      bio: "Oversees the implementation of the frontend and backend of the Launchpad Career Hub platform.",
      github: "https://github.com/manineedtosleep",
      linkedin: "https://www.linkedin.com/in/bryan-gunawan-a537132b9/"
    },
    {
      name: "Kristian Godinez",
      role: "Frontend Developer",
      bio: "Specializes in creating responsive and accessible user interfaces for optimal user experience.",
      github: "https://github.com/DeniedPath",
      linkedin: "https://www.linkedin.com/in/kristian-godinez-78a1b6284/"
    },
    {
      name: "Jamir Ong", //onged
      role: "Project Manager",
      bio: "Coordinates team efforts and ensures project milestones are met efficiently.",
      github: "https://github.com/CSJong06",
      linkedin: "https://www.linkedin.com/in/jamir-ong-4823912b4"
    },
    {
      name: "Demitri D. Lyons", //dmirty
      role: "Full Stack Engineer",
      bio: "Implements comprehensive solutions across frontend and backend systems.",
      github: "https://github.com/DDeluca06",
      linkedin: "https://www.linkedin.com/in/demitri-deluca-lyons-747312319/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals behind the Launchpad Career Hub platform. 
            Our dedicated team works tirelessly to help connect talent with opportunities.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow bg-white rounded-xl">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h2>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-4">{member.bio}</p>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  {member.linkedin && (
                    <Link 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${member.name}'s LinkedIn`}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <Linkedin size={18} />
                    </Link>
                  )}
                  {member.github && (
                    <Link 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${member.name}'s GitHub`}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
                    >
                      <Github size={18} />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <footer className="text-center mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} Launchpad Career Hub. All rights reserved.
          </p>
          <div className="mt-4">
            <Link 
              href="/privacy" 
              className="text-sm text-blue-600 hover:text-blue-800 mx-2"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-blue-600 hover:text-blue-800 mx-2"
            >
              Terms of Service
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-blue-600 hover:text-blue-800 mx-2"
            >
              Contact Us
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
