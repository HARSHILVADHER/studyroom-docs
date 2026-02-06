import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const Header = () => (
  <header className="border-b border-border bg-card">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="StudyRoom Science" className="h-10 w-auto" />
      </Link>
      <nav className="flex items-center gap-1">
        <Link
          to="/admit-card"
          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
        >
          Admit Card
        </Link>
        <Link
          to="/result"
          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
        >
          Result
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
