import { Link } from "wouter";
import { TrendingUp, Github, Twitter, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Dashboard", href: "/" },
      { label: "Stock Search", href: "/search" },
      { label: "Watchlist", href: "/watchlist" },
      { label: "Batch Analysis", href: "/batch-analysis" },
      { label: "Valuation Tool", href: "/valuation" }
    ],
    resources: [
      { label: "Rule One Guide", href: "/guide" },
      { label: "Investment Methodology", href: "/methodology" },
      { label: "Financial Metrics", href: "/metrics" },
      { label: "API Documentation", href: "/api-docs" },
      { label: "Help Center", href: "/help" }
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact", href: "/contact" },
      { label: "Feedback", href: "/feedback" }
    ]
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Rule One Assistant
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phil Town's Investment Method
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 max-w-md">
              Democratizing Phil Town's Rule One investing methodology through comprehensive 
              stock analysis tools, automated metrics calculation, and data-driven investment decisions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:support@example.com"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {currentYear} Rule One Assistant. All rights reserved.
            </div>
            
            {/* Phil Town Attribution */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Based on</span>
              <a 
                href="https://www.ruleoneinvesting.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <span>Phil Town's Rule One</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Data Sources */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Data by Alpha Vantage, FMP & Yahoo Finance
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> This platform is for educational purposes only and should not be considered 
            as financial advice. All investment decisions should be made after conducting your own research and 
            consulting with qualified financial advisors. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}