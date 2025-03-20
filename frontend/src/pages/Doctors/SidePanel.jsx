import convertTime from "../../utils/convertTime";
import { BASE_URL } from "./../../config";
import { token } from "./../../config";
import { toast } from "react-toastify";
import { useState, useContext } from 'react';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SidePanel = ({doctorId, ticketPrice, timeSlots}) => {
  const [loading, setLoading] = useState(false);
  const { token: authToken, role } = useContext(authContext);
  const navigate = useNavigate();

  const bookingHandler = async () => {
    if(!authToken) {
      return navigate('/login');
    }
    
    if(role === 'doctor') {
      return toast.error('Doctors cannot book appointments');
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${authToken}`, // Use token from context
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.session && data.session.url) {
        window.location.href = data.session.url;
      } else {
        throw new Error("No checkout URL received");
      }
      
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text_para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} INR
        </span>
      </div>
      <div className="mt-[30px]">
        <p className="text_para mt-0 font-semibold text-heading Color">
          Available Time Slots:
        </p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) =>
            <li key={index} className="flex items-center justify-between mb-2">
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
              </p>
              <p className="text-[15px] leading-6 text-textColor font-semibold">
                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
              </p>
            </li>
          )}


        </ul>
      </div>

      <button
        onClick={bookingHandler}
        disabled={loading}
        className={`w-full px-2 btn ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-primaryColor/90 active:scale-95'} 
        transition-all duration-200 hover:shadow-md bg-primaryColor text-white text-[18px] 
        leading-[30px] rounded-lg px-4 py-3`}
      >
        {loading ? "Processing..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default SidePanel;