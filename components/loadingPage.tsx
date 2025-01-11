import { motion } from 'framer-motion'

export default function SimpleLoadingAnimation() {
  return (
    <div className="w-full h-screen bg-purple-200 flex flex-col items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity
        }}
      />
      <motion.h2
        className="mt-4 text-2xl font-bold text-purple-800"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity
        }}
      >
        Loading...
      </motion.h2>
    </div>
  )
}