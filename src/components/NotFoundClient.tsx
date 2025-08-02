"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";

export default function NotFoundClient({ t }: { t: Record<string, string> }) {
  const router = useRouter();

  return (
    <div className="min-h-dvh -mt-5 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mt-8">
            {t.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            {t.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center gap-3 justify-center"
        >
          <Button
            color="primary"
            variant="solid"
            size="lg"
            onPress={() => router.back()}
            className="font-semibold"
          >
            {t.backButton}
          </Button>
          <Button
            color="default"
            variant="solid"
            size="lg"
            onPress={() => router.push("/")}
            className="font-semibold"
          >
            {t.homeButton}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-500 dark:text-gray-400">
                {t.ornamentalText}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
