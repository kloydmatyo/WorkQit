# WorkQit Platform

## Team Members & Roles

- **Frontend Developer:** Christian John Castillejo
- **Backend Developer:** Cloyd Matthew Arabe

---

## 🌟 Platform Overview

WorkQit is a dual-purpose platform designed to bridge the gap between education, opportunity, and meaningful employment — especially for individuals from low-income communities and recent graduates. Our mission is to connect users with short-term jobs, remote internships, and apprenticeships across sustainable and emerging industries.

By combining income-generating opportunities with free training and upskilling, the platform empowers users to:

- ✨ Enhance their employability
- 🎯 Gain practical experience
- 🤝 Build professional networks
- 📈 Achieve long-term career stability

---

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Chart.js & D3.js** - Data visualization (planned)

### Backend

- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **Next.js API Routes** - Serverless API endpoints

### Deployment

- **Vercel** - Frontend hosting and serverless functions
- **MongoDB Atlas** - Database hosting

---

## 📦 Dependencies

### Production Dependencies

```json
{
  "next": "14.0.0",
  "react": "^18",
  "react-dom": "^18",
  "mongodb": "^6.2.0",
  "mongoose": "^8.0.0",
  "next-auth": "^4.24.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "tailwindcss": "^3.3.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.31",
  "chart.js": "^4.4.0",
  "react-chartjs-2": "^5.2.0",
  "d3": "^7.8.5",
  "@types/d3": "^7.4.3",
  "lucide-react": "^0.292.0",
  "clsx": "^2.0.0",
  "class-variance-authority": "^0.7.0"
}
```

### Development Dependencies

```json
{
  "typescript": "^5",
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.5",
  "eslint": "^8",
  "eslint-config-next": "14.0.0"
}
```

### Key Package Purposes

#### Core Framework

- **next**: React framework with SSR, routing, and API routes
- **react & react-dom**: Core React library for UI components
- **typescript**: Type safety and better developer experience

#### Database & Authentication

- **mongodb**: Native MongoDB driver for database operations
- **mongoose**: Object modeling for MongoDB with schema validation
- **bcryptjs**: Password hashing for secure authentication
- **jsonwebtoken**: JWT token generation and verification
- **next-auth**: Authentication library for Next.js (optional OAuth)

#### Styling & UI

- **tailwindcss**: Utility-first CSS framework
- **autoprefixer & postcss**: CSS processing and vendor prefixes
- **lucide-react**: Modern icon library
- **clsx**: Utility for constructing className strings
- **class-variance-authority**: Type-safe variant API for components

#### Data Visualization (Planned)

- **chart.js & react-chartjs-2**: Chart library for performance dashboards
- **d3 & @types/d3**: Advanced data visualization for career maps

---

## 🎯 Key Features

### ✅ Implemented Features

#### 🔐 Authentication System

- User registration and login
- Role-based access (Job Seeker, Employer, Mentor, Admin)
- JWT token authentication with HTTP-only cookies
- Secure password hashing

#### 💼 Job Management

- Job posting and browsing
- Advanced filtering (type, location, remote, skills)
- Application tracking system
- Employer job management

#### 👤 User Dashboard

- Application status tracking
- Job recommendations
- Profile management
- Performance statistics

#### 🎨 Responsive UI

- Mobile-first design
- Modern, accessible interface
- Consistent design system
- Loading states and error handling

### 🚧 Planned Features

#### 🎯 Employer Dashboard

- Post and manage internships or apprenticeships
- Evaluate candidates with structured templates
- Streamline onboarding and progress tracking

#### 📊 Internship Performance Tools

- Feedback loops: employer ratings, skill assessments, and reports
- Exportable performance summaries to support future job applications

#### 🧩 Career Exploration Tools

- Interactive Career Map Builder from entry-level to senior roles
- Personalized roadmaps based on skills, interests, and goals

#### 👥 Community & Mentoring

- Peer forums to share tips, experiences, and advice
- Volunteer mentorship from professionals and alumni

#### 🧰 Advanced Features

- File upload for resumes and documents
- Real-time notifications
- Advanced analytics and reporting
- Integration with external job boards

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd workqit-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workqit?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
workqit-platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── jobs/          # Job management endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── jobs/              # Job browsing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── home/              # Home page components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── mongodb.ts         # MongoDB connection
│   └── mongoose.ts        # Mongoose connection
├── models/                # Database models
│   ├── Application.ts     # Application model
│   ├── Job.ts             # Job model
│   └── User.ts            # User model
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🗄️ Database Schema

### User Model

- Personal information (name, email, role)
- Profile data (bio, skills, location, experience)
- Availability and preferences

### Job Model

- Job details (title, description, company)
- Requirements and skills
- Salary and location information
- Application tracking

### Application Model

- Job and applicant references
- Application status and feedback
- Performance ratings and assessments

---

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Configure network access and database user
3. Get connection string and add to environment variables

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team

---

**Built with ❤️ by Christian John Castillejo & Cloyd Matthew Arabe**

Whether you're just starting your career or seeking a stepping stone into the green and tech-forward economy, WorkQit is your partner in growth.
