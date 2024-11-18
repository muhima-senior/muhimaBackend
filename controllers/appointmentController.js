const Appointment = require('../models/appointment');
const Gig = require('../models/gig')
const Freelancer = require('../models/freelancer');


exports.createAppointment = async (req, res) => {
    try {
        const { gigId, userId, appointmentDates, quantity, total } = req.body;
        
        const gig = await Gig.findById(gigId);

        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
    
        const freelancerId = gig.freelancerId;
        // Find the freelancer
        // const freelancer = await Freelancer.findById(freelancerId);
        // if (!freelancer) {
        //     return res.status(404).json({ message: 'Freelancer not found' });
        // }

        // Check if the appointmentDate is in the freelancer's availableSlots
        // const isSlotAvailable = freelancer.availableSlots.some(slot => 
        //     slot.getTime() === new Date(appointmentDate).getTime()
        // );

        // if (!isSlotAvailable) {
        //     return res.status(400).json({ message: 'The selected appointment slot is not available' });
        // }

        // If the slot is available, create the appointment
        const appointment = new Appointment({ gigId, freelancerId, userId, appointmentDates, quantity, total });
        await appointment.save();


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



exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: 'gigId', // Populate gig data
                select: 'title pictureData rating', // Select required fields from Gig model
            })
            .populate({
                path: 'freelancerId', // Populate freelancer data
                select: 'userId pictureData', // Select userId and pictureData from Freelancer model
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
        const appointments = await Appointment.find({ freelancerId: req.params.freelancerId });
        res.status(200).json(appointments);
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


