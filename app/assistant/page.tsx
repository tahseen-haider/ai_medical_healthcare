import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ReportUploader from "@/components/report-uploader";
export default function AssistantPage() {
  return (
    <div className="h-screen w-full grid">
        <div className="flex flex-col">
            <header className="sticky top-0 z-10 flex h-14 bg-background items-center gap-1 border-b px-4">
                <h1 className="text-xl font-semibold text-red-200 whitespace-nowrap">Medical Ai Assistant</h1>
                <div className="w-full flex justify-end gap-2">
                    <ThemeToggler/>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant={'outline'} size={'icon'} className="md:hidden"><Settings/></Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[80vh]">
                            <ReportUploader/>
                        </DrawerContent>
                    </Drawer>
                </div>
            </header>
            <ReportUploader/>
        </div>
    </div>
  )
}
