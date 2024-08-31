import logo from "../assets/TextronautLogo.svg";
import { ReactSVG } from "react-svg";
function Navbar() {
  return (
    <nav className="nav">
      <a href="/" className="site-title">
        <ReactSVG className="logo-title" src={logo} />
        Textronaut
      </a>
      <ul>
        <li>
          <a href="/sample" className="nav-link">preview</a>
        </li>
        
      </ul>
    </nav>
  );
}

export default Navbar;
