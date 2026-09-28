import { ReactNode } from "react";

export default function Control({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card flex flex-col  p-2 text-center w-full md:w-1/3 h-[30vh] md:h-[95vh]">
      {children}
    </div>
  );
}
