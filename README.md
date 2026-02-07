# MarkFeet Reality - Property Inventory Management System

A modern, responsive web application for managing property inventory, built with Next.js 14, React, Tailwind CSS, MongoDB, and Cloudinary.

## Features

### Public Interface
-   **Home Page**: Dynamic landing page with search, featured properties, partners, and contact info.
-   **Property Listings**: Browse available properties with filtering (Title, Location, Type) and sorting.
-   **Property Details**: Detailed view with image gallery, amenities, location map placeholder, and contact form.
-   **Contact & About**: Informational pages with company details.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices.
-   **Dark/Light Mode**: System-aware theme support.

### Admin Dashboard (Protected)
-   **Secure Authentication**: NextAuth.js based login system.
-   **Dashboard Overview**: Key metrics and quick stats.
-   **Property Management**:
    -   Create new property listings with image uploads (Cloudinary).
    -   Edit existing properties.
    -   Delete properties (automatically removes images from Cloudinary).
    -   Toggle visibility (Show/Hide) of properties.
-   **Message Management**: View inquiries submitted via the contact form.

## Technology Stack

-   **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
-   **Backend**: Next.js API Routes, Mongoose (MongoDB).
-   **Authentication**: NextAuth.js.
-   **Media Storage**: Cloudinary.
-   **Styling**: Tailwind CSS with custom theme variables.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB (Local or Atlas URI)
-   Cloudinary Account (for image storage)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Rajan21252125/marrk-feet-realty.git
    cd property-inventory-management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Database
    MONGODB_URI=mongodb://localhost:27017/property-inventory-management

    # Authentication
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_random_string

    # Cloudinary (Images)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    
    # Public variables for client-side uploads
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
    ```

### Database Setup

1.  **Seed Initial Data (Optional):**
    Populate the database with sample property listings.
    ```bash
    npx ts-node scripts/seed.ts
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Create Admin User:**
    Open a new terminal window (keep the server running) and run the registration script.
    ```bash
    node scripts/register-admin.js admin@example.com password123
    ```
    *Note: The server must be running at http://localhost:3000 for this script to work.*

3.  **Open in browser:**
    Visit [http://localhost:3000](http://localhost:3000).

4.  **Access Admin Panel:**
    Visit [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Project Structure

-   `app/`: Next.js App Router structure (pages, layouts, API routes).
    -   `(public)/`: Public facing pages.
    -   `admin/`: Protected admin pages.
    -   `api/`: Backend API endpoints.
-   `components/`: Reusable UI components.
    -   `sections/`: Page-specific sections (Hero, Partners, Listings).
    -   `ui/`: Generic UI elements (Button, Cards, Input).
    -   `admin/`: Admin-specific components (PropertyForm, PropertyCard).
-   `lib/`: Utility functions (DB connection, Auth options, Logger).
-   `models/`: Mongoose schemas (Property, Admin, Message).
-   `scripts/`: Utility scripts (Seed, Register Admin).
-   `public/`: Static assets.

## Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License.
