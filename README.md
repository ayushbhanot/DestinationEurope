# 🌍 Destination Europe

[Visit Destination Europe](https://destination-europe.vercel.app)

Destination Europe is a full-stack web application designed for travel enthusiasts to explore, organize, and share European destinations. This project showcases my skills in building a responsive, secure, and feature-rich web application using modern web technologies.

---

## 🚀 Features

### 🌟 Public Features:
- **Search Destinations:** Users can search destinations by name, region, or country with soft-matching support for minor typos.
- **Detailed Destination Info:** Expandable search results reveal detailed information about each destination.
- **Quick Links:** A “Search on DuckDuckGo” button opens relevant search results in a new tab.
- **Public Lists:** Browse and interact with public destination lists, complete with descriptions, creator nicknames, and average ratings.
- **Interactive Maps:** Visualize destinations on an embedded map powered by the **Leaflet** library, offering location markers and additional insights.

### 🔐 Registered User Features:
- **Custom Destination Lists:** Create, edit, and delete personalized destination lists with privacy settings (public/private).
- **Reviews and Ratings:** Add comments and ratings to public lists to share feedback with other users.
- **Profile Management:** Update account details such as passwords securely.

---

## 🛠️ Tech Stack and Architecture

### Front-End:
- **Framework:** React.js, using reusable and modular components for scalability.
- **State Management:** React hooks (`useState`, `useEffect`, `useContext`) for managing application state efficiently.
- **Routing:** React Router for dynamic navigation between pages.
- **Styling:** CSS modules and media queries for a responsive user experience across devices.
- **Mapping:** Leaflet library integrated for interactive map rendering and marker-based destination visualization.

### Back-End:
- **Framework:** Node.js with Express.js for building a robust and scalable REST API.
- **Authentication:** Secure user login and registration using JWT (JSON Web Tokens).
- **Database:** MongoDB with Mongoose for modeling and managing collections.
- **Input Validation:** Libraries like `express-validator` to sanitize and validate user inputs, ensuring security.

---

## 📑 Application Flow

1. **Authentication and Authorization:**
   - Users can register with a valid email, nickname, and password. Passwords are securely hashed using bcrypt.
   - JWT is used for session management, protecting user-specific routes.

2. **Destination Search and Management:**
   - Dynamic filtering allows users to search destinations by name, region, or country.
   - Search results include expandable cards for detailed information and direct links for further research.

3. **Interactive Maps:**
   - Destinations are displayed on a Leaflet-powered map, with markers that users can click for additional location details.

4. **User-Specific Features:**
   - Registered users can create named lists of destinations with descriptions and toggle public/private visibility.
   - Lists are dynamically updated and synchronized with the database upon edits or deletions.

5. **Public Collaboration:**
   - Users can explore public destination lists, leave ratings, and add comments, fostering a community-driven experience.

---

## 📫 Contact

Feel free to connect or share feedback:

- **Email:** ayushbhanot1010@gmail.com
- **GitHub:** [ayushbhanot](https://github.com/ayushbhanot)
