<<<<<<< HEAD
# AstroInsight: AI-Powered Astrology & Life Guidance

AstroInsight is a full-stack web application designed to give users personalized astrological readings using the power of OpenAI. Users can select their zodiac sign and a specific life domain (Career, Health, Relationships, Personal Growth) to receive uplifting star-guided insights.

## Technologies Used
- **Frontend**: React.js (Vite), React Router, Axios, Lucide React, Custom CSS (Glassmorphism design)
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt for password hashing
- **Database**: MongoDB (via Mongoose)
- **AI Integration**: OpenAI API (`gpt-3.5-turbo`)

## Requirements
- Node.js (v16+)
- A MongoDB Connection String (Atlas or Local)
- An OpenAI API Key (optional for Demo Mode)

## Project Initialization

Follow these steps to get the application running on your local machine.

### 1. Database & Environment Setup
Navigate to the `server/` directory and configure the environment variables:
```bash
cd server
```
Ensure you have a `.env` file in the `server` directory. The structure looks like this:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=supersecretjwtkey_astroinsight_2026
OPENAI_API_KEY=your_openai_api_key_here
```
*Note: If you leave `OPENAI_API_KEY` as `your_openai_api_key_here` or blank, the system will use a built-in static Demo Mode to generate insights without throwing an error.*

### 2. Start the Backend Server
From the `server` directory, install the required packages and run the development server:
```bash
npm install
npm run dev
```
You should see: `Server running on port 5000` and `MongoDB Connected`.

### 3. Start the Frontend Application
Open a new terminal, navigate to the `client/` directory, install packages, and start Vite:
```bash
cd client
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Features
- **Authentication**: Secure JWT-based Login and Registration.
- **Dashboard**: Generate new celestial insights into specific life domains and store a track record of past guidance.
- **Admin Panel**: An exclusive tab for users with `isAdmin` flag equal to `true` in MongoDB, enabling them to view globally generated insights and registered users.
- **Cosmic UI**: Deep space CSS animations and frosted glass elements providing a premium aesthetic.
=======
# AstroInsight
A full-stack web application for generating personalized astrology predictions using user birth data. 🚧 In progress.
>>>>>>> ec8b24a104c18a63d67048bcf62ffde16b84aead
