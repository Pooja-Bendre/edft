# 🌍 E-FDT Platform

## 📋 Overview

*E-FDT (Environmental Feasibility & Development Tool)* is India's most advanced AI-powered platform for sustainable urban development. The platform leverages artificial intelligence to deliver comprehensive site analysis in just 5 seconds - a process that traditionally takes 6-12 months and costs ₹50 Lakh.

### ✨ Key Features

- ⚡ *5-Second Analysis* - Lightning-fast comprehensive site evaluation
- 💎 *Carbon Credit Verification* - Gold Standard methodology with market valuation
- ⚖ *Environmental Justice* - 3x algorithmic priority for low-income areas
- 🗺 *Interactive Maps* - Real-time geospatial visualizations
- 📊 *Real-time Analytics* - Dynamic charts & comprehensive insights
- 🎮 *Gamified Engagement* - Community participation scoring
- 🔐 *Blockchain Verified* - Tamper-proof decision tracking
- 📥 *Export Options* - CSV, JSON & PDF reports
- 🏙 *20 Indian Cities* - Complete coverage of major metros

---

## 🔍 What We Analyze

1. *Site Suitability* - 15+ factors including demographics, infrastructure & environment
2. *Carbon Credits* - Gold Standard verification with market valuation (earn ₹50 Lakh+ per year)
3. *Compliance* - Indian Green Building, LEED India, Net Zero 2070
4. *Climate Scenarios* - Test against 5 IPCC warming scenarios
5. *Financial Model* - Complete ROI analysis with payback period
6. *Social Impact* - UN SDG alignment & job creation
7. *Blockchain Audit* - Immutable & transparent records

---

## 🛠 Tech Stack

- *Frontend*: HTML5, CSS3, JavaScript (Vanilla JS)
- *AI Integration*: Google Gemini API
- *Deployment*: Vercel
- *Architecture*: Client-side rendering with API integration

---

## 🚀 Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API Key ([Get one here](https://ai.google.dev/))
- Node.js (optional, for local development server)

### Installation Steps

1. *Clone the Repository*
   bash
   git clone https://github.com/Pooja-Bendre/edft.git
   cd edft-platform
   

2. *Configure API Key*
   
   Open your project files and locate the API configuration file (usually config.js or within the main JavaScript file):
   
   javascript
   const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
   
   
   Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key.

3. *Run Locally*

   *Option A: Using Python's built-in server*
   bash
   python -m http.server 8000
   
   Then open http://localhost:8000 in your browser.

   *Option B: Using Node.js http-server*
   bash
   npx http-server -p 8000
   
   Then open http://localhost:8000 in your browser.

   *Option C: Direct File Open*
   Simply open the index.html file in your web browser.

4. *Start Using*
   
   Configure your analysis parameters in the sidebar and click *"RUN ANALYSIS"* to begin!

---

## 🌐 Deployment

### Deploy to Vercel

1. *Install Vercel CLI*
   bash
   npm i -g vercel
   

2. *Deploy*
   bash
   vercel
   

3. *Follow the prompts* to link your project and deploy

Alternatively, you can connect your GitHub repository directly to Vercel for automatic deployments.

---

## 📦 Project Structure


edft-platform/
├── index.html          # Main HTML file
├── style.css           # Styling
├── script.js           # Main JavaScript logic
├── config.js           # API configuration (if separate)
├── assets/             # Images, icons, etc.
└── README.md           # This file

special techstack used is AWS for best configuration like S3 , lambda , Amazon Q , CloudFront
---

## 🔑 Environment Variables

For production deployment, set up the following environment variable:

- GEMINI_API_KEY - Your Google Gemini API key

*Note*: For security, never commit your API keys to version control. Use environment variables or configuration files that are gitignored.

---

## 💡 Usage

1. *Select Parameters* - Choose your city, project type, and analysis criteria from the sidebar
2. *Run Analysis* - Click the "RUN ANALYSIS" button
3. *View Results* - Explore interactive maps, charts, and comprehensive insights
4. *Export Data* - Download results in CSV, JSON, or PDF format
5. *Track Progress* - Monitor blockchain-verified decision records

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Google Gemini AI for powering the analysis engine
- Vercel for hosting infrastructure
- The open-source community for inspiration

---

## 📧 Contact

For questions, suggestions, or support, please open an issue on GitHub or contact the development team.

---

## 🌟 Star Us!

If you find this project helpful, please give it a ⭐ on GitHub!

---

*Made with ❤ for sustainable urban development in India*
