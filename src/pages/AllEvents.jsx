import Aboutevents from "./Alleventssection/Aboutevents";
import Navbar from "./Alleventssection/Navbar";
import Soon from "./Alleventssection/ComingSoonEvents";
import Faqs from "../Faqs";
import Footer from "../Footer";

function AllEvents(){
  return(
    <>
    <Navbar/>
    <Aboutevents/>
    <Soon />
    <Footer/>
    </>
  )
}

export default AllEvents;