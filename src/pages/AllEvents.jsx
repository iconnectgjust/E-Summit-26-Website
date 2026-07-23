import Aboutevents from "./Alleventssection/Aboutevents";
import Navbar from "./Alleventssection/Navbar";
import Soon from "./Alleventssection/ComingSoonEvents";
import Faqs from "../Faqs";

function AllEvents(){
  return(
    <>
    <Navbar/>
    <Aboutevents/>
    <Soon />
    </>
  )
}

export default AllEvents;