import Navbar from "@/components/Navbar/Navbar";

 
export default function AppLayout({ children }) {
  return (
    <div className="bg-light text-white min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}