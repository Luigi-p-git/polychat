import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [tabPositions, setTabPositions] = React.useState<{ left: number; width: number }[]>([])
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const updateTabPositions = () => {
      if (listRef.current) {
        const tabs = listRef.current.querySelectorAll('[role="tab"]')
        const positions = Array.from(tabs).map((tab) => {
          const rect = tab.getBoundingClientRect()
          const listRect = listRef.current!.getBoundingClientRect()
          return {
            left: rect.left - listRect.left,
            width: rect.width
          }
        })
        setTabPositions(positions)
        
        // Find active tab
        const activeIndex = Array.from(tabs).findIndex(tab => tab.getAttribute('data-state') === 'active')
        if (activeIndex !== -1) {
          setActiveTab(activeIndex)
        }
      }
    }

    updateTabPositions()
    
    // Use MutationObserver to watch for changes in tab states
    const observer = new MutationObserver(updateTabPositions)
    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ['data-state']
      })
    }

    return () => observer.disconnect()
  }, [props.children])

  return (
    <TabsPrimitive.List
      ref={(node) => {
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
        listRef.current = node
      }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-2xl bg-muted/30 p-1 text-muted-foreground backdrop-blur-sm border-0",
        className
      )}
      {...props}
    >
      {tabPositions.length > 0 && (
        <motion.div
          className="absolute bg-background rounded-xl shadow-lg shadow-black/5 z-0"
          initial={false}
          animate={{
            left: tabPositions[activeTab]?.left || 0,
            width: tabPositions[activeTab]?.width || 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          style={{
            height: 'calc(100% - 8px)',
            top: 4
          }}
        />
      )}
      {props.children}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground hover:text-foreground/80 border-0 z-10",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }