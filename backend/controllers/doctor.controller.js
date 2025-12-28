import Doctor from "../models/Doctor.model.js";
import User from "../models/User.model.js";
import Role from "../models/Role.model.js";
import { hashPassword } from "../utils/hash.js";
/**
 * CREATE Doctor (Admin only)
 */

export const createDoctor = async (req, res) => {
    try {
        const {
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            username,
            password,
            specialization,
            availability,
            email
        } = req.body;

        // 1️⃣ Validate required fields
        if (!name || !username || !password || !specialization || !phone_no) {
            return res.status(400).json({
                message: "Required fields missing"
            });
        }

        // 2️⃣ Fetch doctor role
        const doctorRole = await Role.findOne({ name: "doctor", enabled: true });
        if (!doctorRole) {
            return res.status(400).json({ message: "Doctor role not found" });
        }

        // 3️⃣ Check username & phone uniqueness
        const existingUser = await User.findOne({
            $or: [{ username }, { phone_no }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Username or phone number already exists"
            });
        }

        // 4️⃣ Hash password
        const hashedPassword = await hashPassword(password);

        // 5️⃣ Create User
        const user = await User.create({
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            username,
            password: hashedPassword,
            role: doctorRole._id,
            email
        });

        // 6️⃣ Create Doctor Profile
        const doctor = await Doctor.create({
            user: user._id,
            name: `${name}${surname ? " " + surname : ""}`,
            specialization,
            availability: availability || "Available"
        });

        // 7️⃣ Success response
        res.status(201).json({
            message: "Doctor created successfully",
            doctor
        });

    } catch (error) {
        console.error("Create doctor error:", error);
        res.status(500).json({
            message: "Failed to create doctor"
        });
    }
};
/**
 * GET All Doctors
 */
export const getDoctors = async (req, res) => {
    try {
        const { search } = req.query;

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { specialization: { $regex: search, $options: "i" } }
            ];
        }
        const doctors = await Doctor.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            { $match: { "user.enabled": true } },
            {
                $project: {
                    "specialization": 1,
                    "availability": 1,
                    "name": {
                        $trim: {
                            input: {
                                $concat: [
                                    { $ifNull: ["$user.name", ""] },
                                    " ",
                                    { $ifNull: ["$user.surname", ""] }
                                ]
                            }
                        }
                    },
                    "user._id": 1,
                    "user.name": 1,
                    "user.surname": 1,
                    "user.gender": 1,
                    "user.date_of_birth": 1,
                    "user.phone_no": 1,
                    "user.address": 1,
                    "user.location": 1,
                    "user.username": 1,
                    "user.email": 1,
                    "user.enabled": 1,
                    createdAt: 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Get doctors error:", error);
        res.status(500).json({ message: "Failed to fetch doctors" });
    }
};

export const updateActiveStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        doctor.availability = 'Unavailable';

        await doctor.save();
        res.status(200).json({
            message: "Doctor updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor"
        });
    }
}

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            surname,
            gender,
            date_of_birth,
            phone_no,
            address,
            location,
            specialization,
            availability,
            enabled,
            email
        } = req.body;

        // 1️⃣ Find doctor
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // 2️⃣ Update Doctor fields
        if (specialization !== undefined) doctor.specialization = specialization;
        if (availability !== undefined) doctor.availability = availability;
        if (enabled !== undefined) doctor.enabled = enabled;

        await doctor.save();

        // 3️⃣ Update linked User fields
        const userUpdates = {};
        if (name !== undefined) userUpdates.name = name;
        if (surname !== undefined) userUpdates.surname = surname;
        if (gender !== undefined) userUpdates.gender = gender;
        if (date_of_birth !== undefined) userUpdates.date_of_birth = date_of_birth;
        if (phone_no !== undefined) userUpdates.phone_no = phone_no;
        if (address !== undefined) userUpdates.address = address;
        if (location !== undefined) userUpdates.location = location;
        if (email !== undefined) userUpdates.email = email;

        if (Object.keys(userUpdates).length > 0) {
            await User.findByIdAndUpdate(doctor.user, userUpdates, {
                new: true,
                runValidators: true
            });
        }

        res.status(200).json({
            message: "Doctor updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor"
        });
    }
};