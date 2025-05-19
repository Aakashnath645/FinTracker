
# 💰 FinTrck – Personal Finance Tracker PWA

A modern, offline-capable Progressive Web App (PWA) for tracking personal expenses, visualizing spending, and setting budget goals. **FinTrck** is built entirely with front-end technologies and deployed on Netlify, requiring **no backend**.

🔗 [Live Demo](https://fintrckapp.netlify.app/)

---

## 🚀 Features

- **Expense Tracking:** Log daily expenses with amount, category, and notes.
- **Dashboard:** Visualize spending with interactive charts and summaries.
- **Budget Goals:** Set monthly budgets and track your progress.
- **Offline Support:** Works seamlessly without internet — your data is stored locally.
- **Responsive Design:** Optimized for mobile, tablet, and desktop.
- **Light/Dark Mode:** Switch between themes for comfortable viewing.
- **Data Export:** Download your expenses as a CSV file.
- **Installable PWA:** Add FinTrck to your home screen for a native app experience.

---

## 🛠️ Tech Stack

- **React.js** – Component-based UI development
- **Chart.js** – Interactive data visualizations
- **localStorage** – Persistent client-side data storage
- **Service Worker & Manifest** – PWA features for offline capability and installability
- **HTML5 & CSS3** – Semantic markup and responsive, accessible design
- **Netlify** – Fast, global, and reliable static site hosting


## 📦 Installation & Development

```bash
# 1. Clone the repository:
git clone https://github.com/Aakashnath645/fintrck.git
cd fintrck

# 2. Install dependencies:
npm install

# 3. Start the development server:
npm start

# 4. Build for production:
npm run build
```

### 🛰️ Deploy to Netlify

- Push your code to a GitHub repository.
- Connect your GitHub repo to [Netlify](https://www.netlify.com/).
- Netlify will automatically build and deploy your app.
- Configure your build settings if needed:
  - **Build Command:** `npm run build`
  - **Publish Directory:** `build/`

---

## 🧑‍💻 Usage

- **Add Expenses:** Enter amount, category, date, and optional notes.
- **View Dashboard:** Analyze your spending with charts and summaries.
- **Set Budgets:** Define monthly limits and monitor progress.
- **Offline-First:** All features work offline; data is saved in your browser.
- **Export Data:** Download your expenses as CSV for backup or analysis.

---

## 🗂️ Project Structure

```
src/
├── assets/        # Images and static assets
├── components/    # Reusable React components
├── pages/         # Main app pages (Dashboard, Add Expense, Settings, etc.)
├── utils/         # Helper functions (e.g., for localStorage)
├── styles/        # CSS and theme files
├── App.js         # Main app component
└── index.js       # Entry point
```

---

## 🏗️ Key Implementation Details

- **localStorage** is used for all user data (expenses, budgets, preferences).
- **Service Worker** caches assets for offline use.
- **Chart.js** renders charts for expense analysis.
- **Responsive CSS** ensures usability on all devices.
- **Theme toggling** for light/dark mode.

---

## 📱 PWA Features

- **Offline-First:** App loads and functions offline.
- **Installable:** Prompt to add to home screen on mobile and desktop.
- **Manifest File:** Custom icon, theme color, and app name.

---

## 🌍 Deployment

FinTrck is deployed on [Netlify](https://www.netlify.com), leveraging:

- **Global Edge Network:** Fast content delivery worldwide.
- **Continuous Deployment:** Automatic builds from GitHub pushes.
- **Instant Rollbacks:** Quickly revert to previous versions if needed.

---

## 🧩 Possible Extensions

- Multi-currency support
- Category customization
- Data synchronization (if backend is added in the future)
- Notifications for budget limits

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

---

## 📧 Contact

Questions, suggestions, or feedback?  
Open an issue or reach out at [aakashnath645@example.com](mailto:aakashnath645@gmail.com).

---

_FinTrck is a practical demonstration of modern front-end development, PWA capabilities, and client-side data management – perfect for portfolios and real-world use!_
