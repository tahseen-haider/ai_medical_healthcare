import { Button } from "@/components/ui/button";
export default function Btn({children, onClick}: {children: React.ReactNode, onClick: ()=>void}) {
  return (
    <Button
      onClick={onClick}
      className="bg-white hover:bg-gray-100 text-black shadow-[0_0_6px_rgba(0,0,0,0.4)]"
    >
      {children}
    </Button>
  );
}
