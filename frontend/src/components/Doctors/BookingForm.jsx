import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const BookingForm = ({ doctor = {}, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ticketPrice: doctor?.ticketPrice || 0,
    appointmentDate: '',
    timeSlot: '',
    message: ''
  });
  
  const { token, user } = useContext(authContext);
  const navigate = useNavigate();

  if (!doctor?._id) {
    return <div>Loading...</div>;
  }

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    // Form validation
    if (!formData.appointmentDate || !formData.timeSlot) {
      setLoading(false);
      return toast.error('Please select both date and time slot');
    }

    // Check authentication
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor: doctor._id,
          user: user._id,
          ticketPrice: formData.ticketPrice,
          appointmentDate: formData.appointmentDate,
          timeSlot: formData.timeSlot,
          message: formData.message
        })
      });

      const { data, message } = await res.json();

      if (!res.ok) {
        throw new Error(message || 'Something went wrong');
      }

      setLoading(false);
      toast.success('Successfully booked appointment');
      navigate('/users/profile/me');

    } catch (err) {
      setLoading(false);
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 md:py-0">
      <input
        type="date"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={handleInputChange}
        required
      />
      <input
        type="time"
        name="timeSlot"
        value={formData.timeSlot}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="message"
        placeholder="Reason for visit"
        value={formData.message}
        onChange={handleInputChange}
        required
      />
      <div className="mt-7">
        <button
          disabled={loading}
          type="submit"
          className={`w-full bg-primaryColor text-white text-[18px] px-4 py-3 rounded-lg ${
            loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-primaryColor/90'
          }`}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default BookingForm;
