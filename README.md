# RuleOneInvestor: Your Compass for Value Investing
<!-- Optional Badges: Build Status, Coverage, License -->
<!-- ![Build Status](link_to_build_status_badge) -->
<!-- ![License](link_to_license_badge) -->
RuleOneInvestor is a comprehensive web application meticulously crafted to empower individual investors with the tools and insights needed to apply Phil Town's Rule #1 Investing principles. Our mission is to demystify financial analysis and help you confidently identify wonderful companies at attractive prices.
## Table of Contents (Optional - for very long READMEs)
- [Why RuleOneInvestor?](#why-ruleoneinvestor)
- [Core Philosophy: Rule #1 Investing](#core-philosophy-rule-1-investing)
- [Key Features](#key-features)
- [Analyses Performed](#analyses-performed)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Data Sources](#data-sources)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact & Acknowledgements](#contact--acknowledgements)
## Why RuleOneInvestor?
In today's complex market, performing thorough fundamental analysis can be daunting and time-consuming. RuleOneInvestor simplifies this by:
- **Automating Data Collection & Calculation:** Spend less time number-crunching and more time understanding businesses.
- **Providing a Structured Framework:** Follow a proven methodology for value investing.
- **Centralizing Your Research:** Access all necessary tools and data in one platform.
- **Enhancing Decision Making:** Gain clarity and confidence in your investment choices.
Whether you're new to Rule #1 Investing or a seasoned practitioner, this tool is designed to streamline your workflow and elevate your analysis.
## Core Philosophy: Rule #1 Investing
This application is built upon the foundational principles of **Rule #1 Investing**, as popularized by Phil Town. This value investing strategy emphasizes:
1. **Finding Wonderful Companies:** Identifying businesses with strong moats, understandable operations, and capable management.
2. **Determining Intrinsic Value:** Calculating what a company is truly worth based on its financial health and future prospects.
3. **Buying at an Attractive Price:** Investing only when there's a significant Margin of Safety – buying a dollar for fifty cents.
4. **Focusing on the "Big Four" Growth Numbers:** Consistently growing Sales, Earnings Per Share (EPS), Equity (Book Value), and Free Cash Flow (FCF) are key indicators of a healthy, expanding business.
RuleOneInvestor provides the tools to rigorously assess companies against these criteria.
## Key Features
The platform offers a suite of powerful features:
- **Comprehensive Stock Search:** Easily find and select companies for analysis by symbol or name.
- **Automated Rule #1 Metrics:**
  - Calculation of the "Big Four" growth rates (Sales, EPS, Equity, FCF).
  - Return on Invested Capital (ROIC) and Return on Equity (ROE) analysis.
  - Debt analysis and Payback Time calculation.
- **Valuation Tools:**
  - Sticker Price (Intrinsic Value) calculation based on future earnings potential.
  - Margin of Safety (MOS) price determination.
- **Financial Data Visualization:** Interactive charts and tables to visualize historical financial performance, balance sheet health, and cash flow trends.
- **Watchlist Management:** Create and monitor a personalized list of stocks you're tracking.
- **News Integration:** (Potential Feature) Access relevant news articles for selected companies.
- **Batch Analysis:** (Potential Feature) Analyze multiple stocks simultaneously to quickly screen for opportunities.
- **User Accounts & Authentication:** Securely save your watchlists and preferences.
## Analyses Performed
RuleOneInvestor conducts a variety of analyses to provide a holistic view of a company's investment potential according to Rule #1 principles:
- **Fundamental Strength Analysis:** Deep dive into financial statements to calculate and interpret key metrics like the Big Four growth rates, ROIC, and debt levels.
- **Valuation Analysis:** Determine a company's intrinsic value (Sticker Price) and identify appropriate buy prices based on Margin of Safety.
- **Financial Health Assessment:** Evaluate the robustness of a company's balance sheet, its ability to manage debt, and the consistency of its free cash flow generation.
- **Growth Trend Analysis:** Analyze historical and projected growth rates across key financial indicators to ensure sustainable expansion.
- **Moat Assessment (Qualitative Support):** While primarily quantitative, the data provided helps users assess the strength and durability of a company's competitive advantages (Moat).
- **(Future) Dividend Analysis:** Evaluate dividend history, payout ratios, and sustainability for income-focused investors.
- **(Future) Sentiment Analysis:** Gauge market sentiment from news and social data to understand broader perceptions.
## Screenshots
(This section would ideally include screenshots of the application's key interfaces. You can add them as the UI develops.)
Example:
`![Dashboard View](path/to/your/dashboard_screenshot.png)`
`![Stock Analysis Page](path/to/your/analysis_screenshot.png)`
## Tech Stack
The application is built using a modern and robust web development stack:
- **Frontend:**
  - **React with TypeScript:** For building a dynamic, type-safe, and maintainable user interface.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development and consistent styling.
  - **Shadcn UI:** (If used) Pre-built, accessible UI components to accelerate development.
- **Backend:**
  - **Node.js with Express.js & TypeScript:** A powerful and scalable foundation for the server-side logic and API development, enhanced with type safety.
- **Database:**
  - **Drizzle ORM:** A TypeScript-first ORM for type-safe and efficient database interactions (e.g., with PostgreSQL, MySQL, or SQLite).
- **Build & Development Tools:**
  - **Vite:** A next-generation frontend tooling that provides an extremely fast development server and optimized build process.
- **Deployment:** (Specify if known, e.g., Vercel, Netlify, AWS, Docker)
## Data Sources
The platform relies on reputable financial data providers to deliver accurate and timely information:
- **Alpha Vantage:** A primary source for historical and real-time stock data, including company overviews, global quotes, financial statements (income, balance sheet, cash flow), and earnings reports.
  - *Note: Requires an API key. See [Configuration](#configuration).*
- **Financial Modeling Prep (FMP):** (If used) An alternative or supplementary source for a broad range of financial data, potentially offering different data points or higher API limits.
  - *Note: May require an API key. See [Configuration](#configuration).*
- **Brave Search API:** (If used for news) For fetching relevant news articles and web content to provide market context.
## Getting Started
Follow these instructions to set up and run the RuleOneInvestor project locally.
### Prerequisites
- Node.js (LTS version recommended, e.g., v18.x or v20.x)
- npm (comes with Node.js) or Yarn
- Git
### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/RuleOneInvestor.git
    cd RuleOneInvestor
    ```
2. **Install dependencies:**
    Navigate to both the `server` and `client` (or root, depending on your setup) directories and run:
    ```bash
    npm install
    # or
    yarn install
    ```
### Configuration
1. **Set up environment variables:**
    The application requires API keys for data sources. Create a `.env` file in the `server` directory (or root, as appropriate).
    You can usually copy an example file if one is provided:
    ```bash
    cp .env.example .env
    ```
    Then, edit the `.env` file with your actual API keys:
    ```env
    # Example .env content for the server
    ALPHA_VANTAGE_API_KEY=YOUR_ALPHA_VANTAGE_KEY
    # FMP_API_KEY=YOUR_FMP_KEY (if applicable)
    # DATABASE_URL=your_database_connection_string (e.g., for PostgreSQL)
    # SESSION_SECRET=your_strong_session_secret
    # GOOGLE_CLIENT_ID=your_google_oauth_client_id (if auth is set up)
    # GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret (if auth is set up)
    ```
    *Obtain API keys from [Alpha Vantage](https://www.alphavantage.co/support/#api-key) and other respective services.*
2. **Database Setup:** (If using a local database like PostgreSQL)
- Ensure your database server is running.
- Create the database if it doesn't exist.
- Run database migrations using Drizzle ORM (commands depend on your Drizzle setup, e.g., `npm run db:migrate`).
### Running the App
1. **Start the backend server:**
    Navigate to the `server` directory (if applicable) and run:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The server will typically start on a port like `5000` or `3001`.
2. **Start the frontend development server:**
    Navigate to the `client` directory (if applicable) and run:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend will typically start on a port like `3000` or `5173` (Vite default).
3. Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
## Project Structure
A brief overview of the main directories:
- `client/`: Contains all frontend code (React components, styles, assets).
  - `src/`: Main source folder for the client application.
- `server/`: Contains all backend code (Express routes, services, database logic).
  - `src/` or `dist/`: Main source/build folder for the server application.
  - `db/`: Database schema, migrations (Drizzle related).
- `shared/`: (If it exists) For TypeScript types, schemas, or utility functions shared between frontend and backend.
- `README.md`: This file.
- `package.json`: Project dependencies and scripts (may have separate ones for client/server or a root one with workspaces).
## Contributing
Contributions are welcome and greatly appreciated! If you'd like to contribute, please follow these guidelines:
1. **Fork the Repository:** Create your own copy of the project.
2. **Create a Feature Branch:** (`git checkout -b feature/AmazingFeature`)
3. **Commit Your Changes:** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch:** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request:** Describe your changes clearly.
**Before contributing:**
- Ensure any install or build dependencies are removed before committing.
- Update documentation if you introduce new features or change existing ones.
- Write clear, concise commit messages.
- Consider adding tests for new functionality.
If you find a bug or have a feature request, please open an issue on the GitHub repository.
## Roadmap
Future enhancements and planned features include:
- [ ] More detailed company comparison tools.
- [ ] Advanced charting options for financial data.
- [ ] User portfolio tracking and performance analysis.
- [ ] Integration of qualitative analysis tools (e.g., checklists for Moat, Management).
- [ ] Enhanced news sentiment analysis.
- [ ] Community features for sharing insights (optional).
- [ ] Mobile responsiveness improvements.
- [ ] More comprehensive test coverage.
## License
This project is licensed under the [MIT License](LICENSE.txt). (Create a LICENSE.txt file with your chosen license, e.g., MIT).
## Contact & Acknowledgements
- Inspired by Phil Town's Rule #1 Investing.
- Data provided by Alpha Vantage (and other sources as listed).
If you have questions, feedback, or want to get involved, please [open an issue](link_to_your_github_issues_page) or contact [Your Name/Email (Optional)].
--------------------------------
## Astro Starter Kit: Basics
```sh
npm create astro@latest -- --template basics
```
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)
> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!
![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)
## 🚀 Project Structure
Inside of your Astro project, you'll see the following folders and files:
```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```
To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).
## 🧞 Commands
All commands are run from the root of the project, from a terminal:
| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
## 👀 Want to learn more?
Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
