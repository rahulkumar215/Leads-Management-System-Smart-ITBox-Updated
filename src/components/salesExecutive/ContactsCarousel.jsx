import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Assets
import call from "../../assets/call.png";
import mail from "../../assets/gmail.png";
import whatsapp from "../../assets/logo (2).png";
import linkedin from "../../assets/linkedin (1).png";
// import managerAvtar from "../../assets/avatar-design.png";
import man from "../../assets/man.png";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

const PrevArrow = (props) => {
  const { className, onClick, style } = props;
  return (
    <HiArrowLeft
      className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 
                 bg-gray-800 text-white rounded-full p-2 cursor-pointer 
                 transition-transform duration-200 hover:scale-105 hover:bg-gray-700"
      onClick={onClick}
      size={30}
    />
  );
};

const NextArrow = (props) => {
  const { className, onClick, style } = props;
  return (
    <HiArrowRight
      className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 
                 bg-gray-800 text-white rounded-full p-2 cursor-pointer 
                 transition-transform duration-200 hover:scale-105 hover:bg-gray-700"
      onClick={onClick}
      size={30}
    />
  );
};

//  contacts.length < 3 ? contacts.length : 3;

export const ContactsCarousel = ({ contacts }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: contacts.length < 3 ? contacts.length : 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const slides = contacts.map((contact) => (
    <div key={contact._id} className="px-2">
      <div className="shadow-md rounded-md bg-white border border-yellow-400 p-4">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-lg font-bold">{contact.name}</h5>
          <div className="flex items-center">
            <img src={man} alt="designation" className="w-7 mr-2" />
            <span className="text-sm text-gray-600 font-semibold tracking-wide">
              {contact.designation}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-700 flex items-center mb-1">
          <img src={call} alt="call" className="w-5 mr-2" />
          {contact.phone} / {contact.alternatePhone}
        </p>
        <p className="text-sm text-gray-700 flex items-center mb-1">
          <img src={mail} alt="mail" className="w-5 mr-2" />
          {contact.email}
        </p>
        <p className="text-sm text-gray-700 flex items-center mb-1">
          <img src={whatsapp} alt="whatsapp" className="w-5 mr-2" />
          {contact.whatsappNumber}
        </p>
        <p className="text-sm text-gray-700 flex items-center">
          <img src={linkedin} alt="linkedin" className="w-5 mr-2" />
          {contact.linkedInUrl}
        </p>
      </div>
    </div>
  ));

  return (
    <div className="mt-8 mb-8">
      <Slider {...settings}>{slides}</Slider>
    </div>
  );
};
