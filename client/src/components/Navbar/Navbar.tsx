import "./Navbar.scss";

const Navbar = () => {
  return (
    <>
      <header className="header">
        <nav className="navbar">
          <h2 className="navbar__heading">
            <a href="/" className="nav-link">
              Notes Generator
            </a>
          </h2>
          <ul>
            <li>
              <a href="#" className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                About
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="nav-link">
                Contact
              </a>
            </li>
          </ul>
          <ul className="nav-right">
            <li>
              <a href="#" className="nav-link sign-in-link">
                SignIn With Google
              </a>
            </li>
            <li>
              <a href="#" className="nav-link report-link">
                Report an issue
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
