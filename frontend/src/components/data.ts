import { CheckCircle, Clock, CreditCard, Stethoscope, UserCheck } from "lucide-react";

export const STATUS_FLOW = [
    { key: "Waiting", label: "Waiting", icon: Clock, color: "bg-yellow-100 text-yellow-700" },
    { key: "Optometrist", label: "Optometrist", icon: Stethoscope, color: "bg-blue-100 text-blue-700" },
    { key: "Occupied", label: "Occupied", icon: UserCheck, color: "bg-orange-100 text-orange-700" },
    { key: "Ready for Payment", label: "Payment", icon: CreditCard, color: "bg-purple-100 text-purple-700" },
    { key: "Completed", label: "Completed", icon: CheckCircle, color: "bg-green-100 text-green-700" },
];

export const DOCTORS = ["Dr. Ramesh", "Dr. Anjali", "Dr. Mehta"];

export const MOCK = [
    {
        id: "1",
        patient: "Rahul Sharma",
        doctor: "Dr. Ramesh",
        type: "Walk-in",
        time: "10:30 AM",
        date: "2025-12-20",
        status: "Waiting",
    },
    {
        id: "2",
        patient: "Neha Verma",
        doctor: "Dr. Anjali",
        type: "Online",
        time: "10:45 AM",
        date: "2025-12-20",
        status: "Optometrist",
    },
    {
        id: "3",
        patient: "Amit Patil",
        doctor: "Dr. Ramesh",
        type: "Walk-in",
        time: "11:00 AM",
        date: "2025-12-18",
        status: "Ready for Payment",
    },
    {
        id: "4",
        patient: "Sneha Kulkarni",
        doctor: "Dr. Mehta",
        type: "Walk-in",
        time: "11:15 AM",
        date: "2025-12-19",
        status: "Occupied",
    },
    {
        id: "5",
        patient: "Rohit Deshmukh",
        doctor: "Dr. Anjali",
        type: "Online",
        time: "11:30 AM",
        date: "2025-12-19",
        status: "Waiting",
    },
    {
        id: "6",
        patient: "Pooja Nair",
        doctor: "Dr. Ramesh",
        type: "Walk-in",
        time: "11:45 AM",
        date: "2025-12-17",
        status: "Optometrist",
    },
    {
        id: "7",
        patient: "Kunal Joshi",
        doctor: "Dr. Mehta",
        type: "Online",
        time: "12:00 PM",
        date: "2025-12-17",
        status: "Occupied",
    },
    {
        id: "8",
        patient: "Anita Rao",
        doctor: "Dr. Anjali",
        type: "Walk-in",
        time: "12:15 PM",
        date: "2025-12-16",
        status: "Waiting",
    },
    {
        id: "9",
        patient: "Suresh Iyer",
        doctor: "Dr. Ramesh",
        type: "Online",
        time: "12:30 PM",
        date: "2025-12-16",
        status: "Ready for Payment",
    },
    {
        id: "10",
        patient: "Mehul Shah",
        doctor: "Dr. Mehta",
        type: "Walk-in",
        time: "12:45 PM",
        date: "2025-12-15",
        status: "Completed",
    },
    {
        id: "11",
        patient: "Nikita Pawar",
        doctor: "Dr. Anjali",
        type: "Walk-in",
        time: "01:00 PM",
        date: "2025-12-15",
        status: "Waiting",
    },
    {
        id: "12",
        patient: "Vikram Singh",
        doctor: "Dr. Ramesh",
        type: "Online",
        time: "01:15 PM",
        date: "2025-12-21",
        status: "Optometrist",
    },
    {
        id: "13",
        patient: "Ayesha Khan",
        doctor: "Dr. Mehta",
        type: "Walk-in",
        time: "01:30 PM",
        date: "2025-12-21",
        status: "Occupied",
    },
    {
        id: "14",
        patient: "Harsh Patel",
        doctor: "Dr. Anjali",
        type: "Online",
        time: "01:45 PM",
        date: "2025-12-21",
        status: "Ready for Payment",
    },
    {
        id: "15",
        patient: "Deepak More",
        doctor: "Dr. Ramesh",
        type: "Walk-in",
        time: "02:00 PM",
        date: "2025-12-21",
        status: "Waiting",
    },

    // A couple outside current week for testing
    {
        id: "16",
        patient: "Sunita Malhotra",
        doctor: "Dr. Mehta",
        type: "Online",
        time: "10:00 AM",
        date: "2025-12-10",
        status: "Completed",
    },
    {
        id: "17",
        patient: "Arjun Kapoor",
        doctor: "Dr. Anjali",
        type: "Walk-in",
        time: "03:00 PM",
        date: "2025-12-25",
        status: "Waiting",
    },
];

export const Services = [
    { "_id": "srv001", "name": "General Consultation", "doctor": "doc001", "amount": 500, "enabled": true },
    { "_id": "srv002", "name": "Eye Checkup", "doctor": "doc002", "amount": 800, "enabled": true },
    { "_id": "srv003", "name": "Skin Consultation", "doctor": "doc003", "amount": 700, "enabled": true },
    { "_id": "srv004", "name": "Dental Checkup", "doctor": "doc004", "amount": 600, "enabled": true },
    { "_id": "srv005", "name": "Blood Pressure Check", "doctor": "doc001", "amount": 300, "enabled": true },
    { "_id": "srv006", "name": "Diabetes Check", "doctor": "doc002", "amount": 400, "enabled": true },
    { "_id": "srv007", "name": "Heart Consultation", "doctor": "doc005", "amount": 1200, "enabled": true },
    { "_id": "srv008", "name": "ENT Consultation", "doctor": "doc006", "amount": 650, "enabled": true },
    { "_id": "srv009", "name": "Physiotherapy Session", "doctor": "doc007", "amount": 900, "enabled": true },
    { "_id": "srv010", "name": "Nutrition Advice", "doctor": "doc008", "amount": 500, "enabled": true },

    { "_id": "srv011", "name": "Follow-up Visit", "doctor": "doc001", "amount": 300, "enabled": true },
    { "_id": "srv012", "name": "Vision Test", "doctor": "doc002", "amount": 350, "enabled": true },
    { "_id": "srv013", "name": "Acne Treatment", "doctor": "doc003", "amount": 900, "enabled": true },
    { "_id": "srv014", "name": "Tooth Cleaning", "doctor": "doc004", "amount": 1000, "enabled": true },
    { "_id": "srv015", "name": "ECG Test", "doctor": "doc005", "amount": 700, "enabled": true },
    { "_id": "srv016", "name": "Hearing Test", "doctor": "doc006", "amount": 450, "enabled": true },
    { "_id": "srv017", "name": "Back Pain Therapy", "doctor": "doc007", "amount": 1100, "enabled": true },
    { "_id": "srv018", "name": "Diet Plan", "doctor": "doc008", "amount": 600, "enabled": true },
    { "_id": "srv019", "name": "Routine Checkup", "doctor": "doc001", "amount": 400, "enabled": true },
    { "_id": "srv020", "name": "Health Counseling", "doctor": "doc008", "amount": 550, "enabled": true }
]

export const paymentMethod = [
    { "_id": "pay001", "name": "Cash", "enabled": true },
    { "_id": "pay002", "name": "Card", "enabled": true },
    { "_id": "pay003", "name": "UPI", "enabled": true },
    { "_id": "pay004", "name": "Cash", "enabled": true },
    { "_id": "pay005", "name": "Card", "enabled": true },
    { "_id": "pay006", "name": "UPI", "enabled": true },
    { "_id": "pay007", "name": "Cash", "enabled": true },
    { "_id": "pay008", "name": "Card", "enabled": true },
    { "_id": "pay009", "name": "UPI", "enabled": true },
    { "_id": "pay010", "name": "Cash", "enabled": true },

    { "_id": "pay011", "name": "Card", "enabled": true },
    { "_id": "pay012", "name": "UPI", "enabled": true },
    { "_id": "pay013", "name": "Cash", "enabled": true },
    { "_id": "pay014", "name": "Card", "enabled": true },
    { "_id": "pay015", "name": "UPI", "enabled": true },
    { "_id": "pay016", "name": "Cash", "enabled": false },
    { "_id": "pay017", "name": "Card", "enabled": true },
    { "_id": "pay018", "name": "UPI", "enabled": true },
    { "_id": "pay019", "name": "Cash", "enabled": true },
    { "_id": "pay020", "name": "Card", "enabled": true }
]


export const appointments =
    [
        {
            "_id": "app001",
            "serialNo": "A-001",
            "patient": "pat001",
            "doctor": "doc001",
            "type": "Appointment",
            "date": "2025-01-10",
            "time": "09:00 AM",
            "status": "stat001",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app002",
            "serialNo": "A-002",
            "patient": "pat002",
            "doctor": "doc002",
            "type": "Walk-in",
            "date": "2025-01-10",
            "time": "09:15 AM",
            "status": "stat002",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app003",
            "serialNo": "A-003",
            "patient": "pat003",
            "doctor": "doc003",
            "type": "Appointment",
            "date": "2025-01-10",
            "time": "09:30 AM",
            "status": "stat001",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app004",
            "serialNo": "A-004",
            "patient": "pat004",
            "doctor": "doc004",
            "type": "Walk-in",
            "date": "2025-01-10",
            "time": "09:45 AM",
            "status": "stat003",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app005",
            "serialNo": "A-005",
            "patient": "pat005",
            "doctor": "doc005",
            "type": "Appointment",
            "date": "2025-01-10",
            "time": "10:00 AM",
            "status": "stat002",
            "createdBy": "usr003",
            "enabled": true
        },

        {
            "_id": "app006",
            "serialNo": "A-006",
            "patient": "pat006",
            "doctor": "doc001",
            "type": "Appointment",
            "date": "2025-01-11",
            "time": "10:15 AM",
            "status": "stat001",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app007",
            "serialNo": "A-007",
            "patient": "pat007",
            "doctor": "doc002",
            "type": "Walk-in",
            "date": "2025-01-11",
            "time": "10:30 AM",
            "status": "stat004",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app008",
            "serialNo": "A-008",
            "patient": "pat008",
            "doctor": "doc003",
            "type": "Appointment",
            "date": "2025-01-11",
            "time": "10:45 AM",
            "status": "stat002",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app009",
            "serialNo": "A-009",
            "patient": "pat009",
            "doctor": "doc004",
            "type": "Walk-in",
            "date": "2025-01-11",
            "time": "11:00 AM",
            "status": "stat003",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app010",
            "serialNo": "A-010",
            "patient": "pat010",
            "doctor": "doc005",
            "type": "Appointment",
            "date": "2025-01-11",
            "time": "11:15 AM",
            "status": "stat005",
            "createdBy": "usr003",
            "enabled": true
        },

        {
            "_id": "app011",
            "serialNo": "A-011",
            "patient": "pat011",
            "doctor": "doc006",
            "type": "Appointment",
            "date": "2025-01-12",
            "time": "09:00 AM",
            "status": "stat001",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app012",
            "serialNo": "A-012",
            "patient": "pat012",
            "doctor": "doc007",
            "type": "Walk-in",
            "date": "2025-01-12",
            "time": "09:15 AM",
            "status": "stat002",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app013",
            "serialNo": "A-013",
            "patient": "pat013",
            "doctor": "doc008",
            "type": "Appointment",
            "date": "2025-01-12",
            "time": "09:30 AM",
            "status": "stat003",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app014",
            "serialNo": "A-014",
            "patient": "pat014",
            "doctor": "doc009",
            "type": "Walk-in",
            "date": "2025-01-12",
            "time": "09:45 AM",
            "status": "stat004",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app015",
            "serialNo": "A-015",
            "patient": "pat015",
            "doctor": "doc010",
            "type": "Appointment",
            "date": "2025-01-12",
            "time": "10:00 AM",
            "status": "stat005",
            "createdBy": "usr003",
            "enabled": true
        },

        {
            "_id": "app016",
            "serialNo": "A-016",
            "patient": "pat016",
            "doctor": "doc001",
            "type": "Walk-in",
            "date": "2025-01-13",
            "time": "10:15 AM",
            "status": "stat001",
            "createdBy": "usr001",
            "enabled": true
        },
        {
            "_id": "app017",
            "serialNo": "A-017",
            "patient": "pat017",
            "doctor": "doc002",
            "type": "Appointment",
            "date": "2025-01-13",
            "time": "10:30 AM",
            "status": "stat002",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app018",
            "serialNo": "A-018",
            "patient": "pat018",
            "doctor": "doc003",
            "type": "Walk-in",
            "date": "2025-01-13",
            "time": "10:45 AM",
            "status": "stat003",
            "createdBy": "usr002",
            "enabled": true
        },
        {
            "_id": "app019",
            "serialNo": "A-019",
            "patient": "pat019",
            "doctor": "doc004",
            "type": "Appointment",
            "date": "2025-01-13",
            "time": "11:00 AM",
            "status": "stat004",
            "createdBy": "usr003",
            "enabled": true
        },
        {
            "_id": "app020",
            "serialNo": "A-020",
            "patient": "pat020",
            "doctor": "doc005",
            "type": "Walk-in",
            "date": "2025-01-13",
            "time": "11:15 AM",
            "status": "stat005",
            "createdBy": "usr003",
            "enabled": true
        }
    ]

export const appointmentHeaders = [
    {
        "_id": "aph001",
        "appointment": "app001",
        "notes": "General checkup completed",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph002",
        "appointment": "app002",
        "notes": "Walk-in consultation",
        "paymentMethod": "pay002",
        "enabled": true
    },
    {
        "_id": "aph003",
        "appointment": "app003",
        "notes": "Follow-up visit",
        "paymentMethod": "pay003",
        "enabled": true
    },
    {
        "_id": "aph004",
        "appointment": "app004",
        "notes": "Prescription updated",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph005",
        "appointment": "app005",
        "notes": "Routine check",
        "paymentMethod": "pay002",
        "enabled": true
    },

    {
        "_id": "aph006",
        "appointment": "app006",
        "notes": "Blood pressure reviewed",
        "paymentMethod": "pay003",
        "enabled": true
    },
    {
        "_id": "aph007",
        "appointment": "app007",
        "notes": "Minor injury treated",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph008",
        "appointment": "app008",
        "notes": "Lab tests advised",
        "paymentMethod": "pay002",
        "enabled": true
    },
    {
        "_id": "aph009",
        "appointment": "app009",
        "notes": "Medication prescribed",
        "paymentMethod": "pay003",
        "enabled": true
    },
    {
        "_id": "aph010",
        "appointment": "app010",
        "notes": "Consultation completed",
        "paymentMethod": "pay001",
        "enabled": true
    },

    {
        "_id": "aph011",
        "appointment": "app011",
        "notes": "Annual health check",
        "paymentMethod": "pay002",
        "enabled": true
    },
    {
        "_id": "aph012",
        "appointment": "app012",
        "notes": "Walk-in fever case",
        "paymentMethod": "pay003",
        "enabled": true
    },
    {
        "_id": "aph013",
        "appointment": "app013",
        "notes": "Diet advice given",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph014",
        "appointment": "app014",
        "notes": "Skin allergy review",
        "paymentMethod": "pay002",
        "enabled": true
    },
    {
        "_id": "aph015",
        "appointment": "app015",
        "notes": "Post-surgery follow-up",
        "paymentMethod": "pay003",
        "enabled": true
    },

    {
        "_id": "aph016",
        "appointment": "app016",
        "notes": "Emergency walk-in",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph017",
        "appointment": "app017",
        "notes": "Routine consultation",
        "paymentMethod": "pay002",
        "enabled": true
    },
    {
        "_id": "aph018",
        "appointment": "app018",
        "notes": "Minor treatment done",
        "paymentMethod": "pay003",
        "enabled": true
    },
    {
        "_id": "aph019",
        "appointment": "app019",
        "notes": "Prescription refilled",
        "paymentMethod": "pay001",
        "enabled": true
    },
    {
        "_id": "aph020",
        "appointment": "app020",
        "notes": "Final consultation",
        "paymentMethod": "pay002",
        "enabled": true
    }
]

export const appointmentLines = [
    {
        "_id": "apl001",
        "appointmentHeader": "aph001",
        "service": "srv001",
        "amount": 500,
        "notes": "General consultation",
        "enabled": true
    },
    {
        "_id": "apl002",
        "appointmentHeader": "aph002",
        "service": "srv002",
        "amount": 800,
        "notes": "Walk-in checkup",
        "enabled": true
    },
    {
        "_id": "apl003",
        "appointmentHeader": "aph003",
        "service": "srv003",
        "amount": 600,
        "notes": "Follow-up visit",
        "enabled": true
    },
    {
        "_id": "apl004",
        "appointmentHeader": "aph004",
        "service": "srv004",
        "amount": 1200,
        "notes": "Skin treatment",
        "enabled": true
    },
    {
        "_id": "apl005",
        "appointmentHeader": "aph005",
        "service": "srv005",
        "amount": 400,
        "notes": "Blood pressure check",
        "enabled": true
    },

    {
        "_id": "apl006",
        "appointmentHeader": "aph006",
        "service": "srv006",
        "amount": 1500,
        "notes": "ECG test",
        "enabled": true
    },
    {
        "_id": "apl007",
        "appointmentHeader": "aph007",
        "service": "srv007",
        "amount": 700,
        "notes": "Minor injury care",
        "enabled": true
    },
    {
        "_id": "apl008",
        "appointmentHeader": "aph008",
        "service": "srv008",
        "amount": 1000,
        "notes": "Lab investigation",
        "enabled": true
    },
    {
        "_id": "apl009",
        "appointmentHeader": "aph009",
        "service": "srv009",
        "amount": 550,
        "notes": "Medication review",
        "enabled": true
    },
    {
        "_id": "apl010",
        "appointmentHeader": "aph010",
        "service": "srv010",
        "amount": 900,
        "notes": "Consultation & advice",
        "enabled": true
    },

    {
        "_id": "apl011",
        "appointmentHeader": "aph011",
        "service": "srv001",
        "amount": 500,
        "notes": "Annual checkup",
        "enabled": true
    },
    {
        "_id": "apl012",
        "appointmentHeader": "aph012",
        "service": "srv002",
        "amount": 800,
        "notes": "Fever consultation",
        "enabled": true
    },
    {
        "_id": "apl013",
        "appointmentHeader": "aph013",
        "service": "srv003",
        "amount": 600,
        "notes": "Diet counseling",
        "enabled": true
    },
    {
        "_id": "apl014",
        "appointmentHeader": "aph014",
        "service": "srv004",
        "amount": 1200,
        "notes": "Allergy treatment",
        "enabled": true
    },
    {
        "_id": "apl015",
        "appointmentHeader": "aph015",
        "service": "srv005",
        "amount": 400,
        "notes": "Post-op check",
        "enabled": true
    },

    {
        "_id": "apl016",
        "appointmentHeader": "aph016",
        "service": "srv006",
        "amount": 1500,
        "notes": "Emergency ECG",
        "enabled": true
    },
    {
        "_id": "apl017",
        "appointmentHeader": "aph017",
        "service": "srv007",
        "amount": 700,
        "notes": "Routine visit",
        "enabled": true
    },
    {
        "_id": "apl018",
        "appointmentHeader": "aph018",
        "service": "srv008",
        "amount": 1000,
        "notes": "Diagnostic tests",
        "enabled": true
    },
    {
        "_id": "apl019",
        "appointmentHeader": "aph019",
        "service": "srv009",
        "amount": 550,
        "notes": "Prescription refill",
        "enabled": true
    },
    {
        "_id": "apl020",
        "appointmentHeader": "aph020",
        "service": "srv010",
        "amount": 900,
        "notes": "Final consultation",
        "enabled": true
    }
]

