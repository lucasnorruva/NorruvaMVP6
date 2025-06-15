
"use client";

import * as React from "react"
import { motion } from "framer-motion"
import { usePathname } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  pageTitle: string
  pageIcon: string
  alertTitle?: string
  alertDescription?: string
}

const DocsPageLayout = ({ children, pageTitle, pageIcon, alertTitle, alertDescription }: DashboardLayoutProps) => {
  const pathname = usePathname()
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  // Dynamically import the icon component based on the pageIcon prop
  const IconComponent = React.useMemo(() => {
    switch (pageIcon) {
      case "Api":
        return (async () => (await import("lucide-react")).Api);
      case "BookText":
        return (async () => (await import("lucide-react")).BookText);
      default:
        return null;
    }
  }, [pageIcon]);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key={pathname}
      className="container relative pt-8"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {IconComponent && (

             {
                const {default: Icon} = await IconComponent();
                return <Icon className="mr-2 h-4 w-4" />;
              })()}

          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
      </div>

      {alertTitle && alertDescription && (
        
          {alertTitle}
          {alertDescription}
        
      )}

      <div className="mt-8">{children}</div>
    </motion.div>
  )
}

export default DocsPageLayout

    