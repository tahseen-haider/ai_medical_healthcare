import { Metadata } from "next"

export const metadata: Metadata = {
    title: "PineconeTrainer"
}

const layout = ({children}: Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="bg-gray-900 h-screen w-screen flex flex-col justify-center items-center">{children}</div>
  )
}

export default layout