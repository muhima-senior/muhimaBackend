const Appointment = require('../models/appointment');
const Gig = require('../models/gig')
const Freelancer = require('../models/freelancer');
const BookingHistory = require('../models/bookingHistory')
const Payment = require('../models/payment');


exports.createAppointment = async (req, res) => {
    try {
        const { gigId, userId, appointmentDates, quantity, total , address, paymentMethod} = req.body;
        
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
    
        const freelancerId = gig.freelancerId;

        const appointment = new Appointment({ gigId, freelancerId, userId, appointmentDates, quantity, total, address, paymentMethod});
        await appointment.save();

        const payment = new Payment({appointmentId: appointment._id, amount: total, paymentMethod:paymentMethod})
        await payment.save();

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.confirmAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { freelancerId, appointmentDate } = req.body;
        const freelancer = await Freelancer.findById(freelancerId);
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointment.status = 'Confirmed';  
        await appointment.save();
        // Remove the booked slot from the freelancer's availableSlots
        freelancer.availableSlots = freelancer.availableSlots.filter(slot => 
            slot.getTime() !== new Date(appointmentDate).getTime()
        );
        await freelancer.save();
        res.status(200).json({ message: 'Appointment confirmed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { appointmentId, status} = req.body;
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        appointment.status = status;
        await appointment.save();
        // Remove the booked slot from the freelancer's availableSlots
        // freelancer.availableSlots = freelancer.availableSlots.filter(slot => 
        //     slot.getTime() !== new Date(appointmentDate).getTime()
        // );
        // await freelancer.save();
        res.status(200).json({ message: 'Appointment confirmed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: 'gigId', // Populate gig data
                select: 'title pictureData rating', // Select required fields from Gig model
            })
            .populate({
                path: 'freelancerId', // Populate freelancer data
                select: 'userId pictureData mobileNumber', // Select userId and pictureData from Freelancer model
                populate: {
                    path: 'userId', // Nested populate to fetch user data
                    select: 'username', // Select username from User model
                },
            });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Convert gig pictureData to Base64 if it exists
        let gigWithBase64Picture = null;
        if (appointment.gigId && appointment.gigId.pictureData) {
            gigWithBase64Picture = {
                ...appointment.gigId._doc, // Spread the gig data
                pictureData: appointment.gigId.pictureData.toString('base64'), // Convert Buffer to Base64
            };
        }

        // Convert freelancer pictureData to Base64 if it exists
        let freelancerWithBase64Picture = null;
        if (appointment.freelancerId) {
            const freelancerData = {
                ...appointment.freelancerId._doc, // Spread freelancer data
                pictureData: appointment.freelancerId.pictureData
                    ? appointment.freelancerId.pictureData.toString('base64') // Convert Buffer to Base64
                    : null, // Handle missing pictureData
            };

            // Include the nested userId data
            freelancerWithBase64Picture = {
                ...freelancerData,
                userId: appointment.freelancerId.userId, // Nested userId (already populated with username)
            };
        }

        // Prepare the final response
        const response = {
            ...appointment._doc, // Spread appointment data
            gigId: gigWithBase64Picture, // Include updated gig data
            freelancerId: freelancerWithBase64Picture, // Include updated freelancer data
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.updateAppointment = async (req, res) => {
    try {
        const { gigId, freelancerId, userId, appointmentDate } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { gigId, freelancerId, userId, appointmentDate }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAppointmentsByFreelancer = async (req, res) => {
    try {
      // Fetch freelancer based on userId
      console.log(req.params.userId)
      const freelancer = await Freelancer.findOne({ userId: req.params.userId });

      if (!freelancer) {
        return res.status(404).json({ error: 'Freelancer not found' });
      }
  
      // Fetch all appointments for the freelancer
      const appointments = await Appointment.find({
        freelancerId: freelancer._id, // Use freelancer's _id after fetching the freelancer
      });
  
      // Use Promise.all to fetch gig details for each appointment
      const appointmentsWithGigTitle = await Promise.all(
        appointments.map(async (appointment) => {
          const gig = await Gig.findById(appointment.gigId);
  
          return {
            ...appointment.toObject(), // Convert Mongoose document to plain JS object
            gigTitle: gig ? gig.title : null, // Append gig title (or null if not found)
          };
        })
      );
  
      // Sort appointments by the earliest date in the 'appointmentDates' array
      appointmentsWithGigTitle.sort((a, b) => {
        const aEarliestDate = new Date(a.appointmentDates[0].date);
        const bEarliestDate = new Date(b.appointmentDates[0].date);
        return aEarliestDate - bEarliestDate; // Ascending order
      });
  
      res.status(200).json(appointmentsWithGigTitle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getAppointmentsByFreelancerPaymentStatus = async (req, res) => { 
    try {
      console.log(req.params.userId);
      
      // Fetch freelancer based on userId
      const freelancer = await Freelancer.findOne({ userId: req.params.userId });
  
      if (!freelancer) {
        return res.status(404).json({ error: 'Freelancer not found' });
      }
  
      // Fetch all appointments for the freelancer
      const appointments = await Appointment.find({
        freelancerId: freelancer._id, // Use freelancer's _id after fetching the freelancer
      });
  
      // Use Promise.all to fetch gig details and payment status for each appointment
      const appointmentsWithDetails = await Promise.all(
        appointments.map(async (appointment) => {
          const gig = await Gig.findById(appointment.gigId);
          const payment = await Payment.findOne({ appointmentId: appointment._id });
  
          return {
            ...appointment.toObject(),     // Convert Mongoose document to plain JS object
            gigTitle: gig ? gig.title : null,  // Append gig title (or null if not found)
            paymentStatus: payment ? payment.status : 'Pending',  // Append payment status or 'Pending' if not found
          };
        })
      );
  
      // Sort appointments by the earliest date in the 'appointmentDates' array
      appointmentsWithDetails.sort((a, b) => {
        const aEarliestDate = new Date(a.appointmentDates[0].date);
        const bEarliestDate = new Date(b.appointmentDates[0].date);
        return aEarliestDate - bEarliestDate; // Ascending order
      });
  
      res.status(200).json(appointmentsWithDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.getAppointmentsByUser = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId });

        // Use Promise.all to fetch gig details for each appointment
        const appointmentsWithGigTitle = await Promise.all(
            appointments.map(async (appointment) => {
                const gig = await Gig.findById(appointment.gigId);
                
                if (gig) {
                    return {
                        ...appointment.toObject(), // Convert Mongoose document to plain JS object
                        gigTitle: gig.title, // Append gig title to the appointment
                    };
                } else {
                    return {
                        ...appointment.toObject(),
                        gigTitle: null, // If gig not found, set gigTitle to null or handle accordingly
                    };
                }
            })
        );

        res.status(200).json(appointmentsWithGigTitle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
