import Image from "next/image";
import { Inter } from "next/font/google";
import Generate from "@/components/Generate/Generate";
import ShowImages from "@/components/ShowImages/ShowImages";
import withAuth from "@/HOCS/withAuth";

const inter = Inter({ subsets: ["latin"] });


function App() {
 
  return (
      <div >
        <Generate />
        <ShowImages />
      </div>
  );
}

export default withAuth(App)