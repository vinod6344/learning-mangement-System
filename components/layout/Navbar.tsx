"use client"

import Link from "next/link"
import ProfileDropdown from "./ProfileDropdown"

interface NavbarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              LMS
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/courses"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Browse Courses
              </Link>
              {user.role === "INSTRUCTOR" && (
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Courses
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  )
}
