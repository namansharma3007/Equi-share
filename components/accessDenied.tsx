'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AccessDeniedPage({navLink}: {navLink: string}) {
  return (
    <div className="min-h-screen bg-purple-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='pb-20'
      >
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 10 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <AlertCircle className="w-12 h-12 text-red-500" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-center text-purple-800">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-purple-600 mb-6"
            >
              Oops! It seems you don't have permission to access this page. If you believe this is an error, please contact the administrator.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-purple-100 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-purple-800 mb-2">What you can do:</h3>
              <ul className="list-disc list-inside text-purple-700 space-y-1">
                <li>Check if you're logged in with the correct account</li>
                <li>Verify your account permissions</li>
                <li>Try refreshing the page</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href={navLink}>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}