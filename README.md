<div align="center">

# 🐦 Bird-Buddies-Fly

**A nostalgic arcade experience reimagined for the modern web.**

*Help Sura navigate through obstacles and relive the classic Flappy Bird excitement!*

> ⚠️ **Disclaimer:** This game is created entirely for entertainment purposes and is not intended to offend anyone. Please play and enjoy it in good spirits!

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

[🚀 Live Demo](#) | [📦 Installation](#-installation) | [🤝 Contributing](#-contributing)

</div>

---

## 📖 About The Project

**Bird-Buddies-Fly** isn't just another clone—it's a tribute to the addictive simplicity of arcade gaming, built with modern web technologies. Take control of **Sura**, our fearless feathered hero, as you navigate through challenging pipes and compete for the highest score.

But that's not all! Discover and unlock new characters as you progress through the game.

### 🎮 Game Modes
*   **Classic Mode:** The traditional "Flappy Sura" experience we all know and love.
*   **Challenge Mode:** Face unique obstacles and dynamic weather conditions.
*   **Multiplayer:** Challenge your friends in real-time battles.

---

## ✨ Features

*   🐦 **Unique Characters**: Play as Sura and other unlockable buddies.
*   🎨 **Stunning UI**: Aesthetic and responsive design powered by Tailwind CSS.
*   🔥 **Real-time Leaderboards**: Compete globally with Firebase Realtime Database integration.
*   💳 **Seamless In-App Purchases**: Unlock skins and power-ups securely via PayU and PhonePe.
*   📱 **Fully Responsive**: Play flawlessly on desktop, tablet, or mobile.
*   ⚡ **Blazing Fast**: Built with Vite for near-instant load times and smooth 60fps gameplay.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18+** | Core UI Library |
| **TypeScript** | Type Safety & Developer Experience |
| **Vite** | Next-Gen Frontend Tooling & Bundling |
| **Tailwind CSS** | Utility-First Styling |
| **Firebase** | Authentication, Database & Hosting |
| **PayU / PhonePe** | Payment Gateway Integration |

---

## 📦 Installation

Get Bird-Buddies-Fly running on your local machine in just a few steps.

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn
*   A Firebase account (for backend features)

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/bird-buddies-fly.git
    cd bird-buddies-fly
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**

    Create a `.env` file in the root directory and add your Firebase and Payment Gateway configurations:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_PAYU_MERCHANT_KEY=your_payu_key
    VITE_PHONEPE_MERCHANT_ID=your_phonepe_id
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open your browser and visit `http://localhost:5173` to start playing!

---

## 💳 Payment Integrations

We've integrated robust payment solutions to handle in-app purchases securely.

### PayU
Used primarily for credit/debit card transactions and net banking.
*   **Flow**: User selects item -> Backend generates Hash -> PayU Checkout -> Webhook verification.
*   **Status**: Fully integrated for INR transactions.

### PhonePe
Integrated for seamless UPI payments.
*   **Flow**: UPI Intent or Popup -> PhonePe App -> Deep link back to Game.
*   **Status**: Supports Standard Checkout flow.

> **Note**: All transactions are secured with server-side verification to prevent fraudulent purchases.

---

## 🕹 How to Play

1.  **Start**: Click/Tap or Press Space to start the game.
2.  **Fly**: Click/Tap or Press Space to make Sura fly upward.
3.  **Avoid**: Navigate through the gaps between pipes.
4.  **Score**: Each successful pass earns you a point.
5.  **Unlock**: Accumulate coins to unlock new characters!

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <h3>Made with ❤️ and ☕ by the Bird-Buddies Team</h3>
</div>
