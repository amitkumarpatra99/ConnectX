import Link from 'next/link';
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 mt-12 bg-glass-dark border-t border-metal-700/50 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <Link href="/" className="text-2xl font-bold metal-text hover:opacity-80 transition-opacity tracking-wide block mb-2">
                        ConnectX
                    </Link>
                    <p className="text-metal-400 text-sm">
                        © {currentYear} ConnectX. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metal-300 hover:text-pink-500 transition-colors transform hover:scale-110 duration-200"
                        aria-label="Instagram"
                    >
                        <FaInstagram size={24} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metal-300 hover:text-sky-400 transition-colors transform hover:scale-110 duration-200"
                        aria-label="Twitter"
                    >
                        <FaTwitter size={24} />
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metal-300 hover:text-blue-600 transition-colors transform hover:scale-110 duration-200"
                        aria-label="LinkedIn"
                    >
                        <FaLinkedin size={24} />
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metal-300 hover:text-white transition-colors transform hover:scale-110 duration-200"
                        aria-label="GitHub"
                    >
                        <FaGithub size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
