# AstroInsight 🌟

AstroInsight is a comprehensive, enterprise-grade astrology platform built on the MERN stack. It leverages a robust, deterministic, rule-based database engine to generate personalized astrological readings based on exact birth data. 

## Features

- **Personalized Horoscope Generation:** Generates dynamic readings by applying astrological rules to birth details without relying on paid black-box AI models.
- **Kundli Visualization:** Automated and structured generation of visual SVG Kundli charts.
- **Tarot & Numerology:** In-depth Tarot card spreads and numerological evaluations.
- **Compatibility Matching:** Advanced compatibility calculation to determine relationship synergy between two individuals.
- **Panchang Dashboard:** Real-time Indian astrology metrics calculation.
- **Enterprise Security:** Secure OTP-based authentication (and 2FA implementations) and self-service password recovery flows.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (or Vanilla CSS based on the project structure)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (using Mongoose for schema modeling of Astrology Rules)
- **Authentication:** JWT, Nodemailer

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MALVIK3044/AstroInsight.git
   cd AstroInsight
   ```

2. **Install Dependencies:**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory and add your credentials (e.g., MongoDB URI, JWT Secret).

4. **Run the Application:**
   ```bash
   # Run the server
   cd server
   npm run dev
   
   # Run the client in another terminal
   cd client
   npm run dev
   ```

## License
This project was developed as a final-year thesis project. 
