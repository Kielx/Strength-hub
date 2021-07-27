/* eslint-disable jsx-a11y/anchor-is-valid */
const Navbar = () => {
  return (
    <nav className="flex px-8 py-12">
      <div className="text-2xl font-extrabold" style={{ flexGrow: "2" }}>
        sunnyside
      </div>
      <div className="hidden md:flex">
        <a
          style={{ minWidth: "8rem" }}
          href="#"
          className="hover:uppercase text-center hover:font-text hover:text-black hover:rounded-full py-3 hover:px-4 hover:bg-white"
        >
          About
        </a>
        <a
          style={{ minWidth: "8rem" }}
          href="#"
          className="hover:uppercase text-center hover:font-text hover:text-black hover:rounded-full py-3 hover:px-4 hover:bg-white"
        >
          Services
        </a>
        <a
          style={{ minWidth: "8rem" }}
          href="#"
          className="hover:uppercase text-center hover:font-text hover:text-black hover:rounded-full py-3 hover:px-4 hover:bg-white"
        >
          Projects
        </a>
        <a
          style={{ minWidth: "8rem" }}
          href="#"
          className="hover:uppercase text-center hover:font-text hover:text-black hover:rounded-full py-3 hover:px-4 hover:bg-white"
        >
          Contact
        </a>
      </div>
      <div className="relative md:hidden">
        <input type="checkbox" id="sortbox" className="hidden absolute" />
        <label
          htmlFor="sortbox"
          className="flex items-center space-x-1 cursor-pointer"
        >
          <svg width="24" height="18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 16v2H0v-2h24zm0-8v2H0V8h24zm0-8v2H0V0h24z"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
        </label>

        <div
          id="triangle-bottomright"
          className="opacity-0 transition delay-75 ease-in-out z-10"
        ></div>
        <div
          id="sortboxmenu"
          className="absolute pb-4 pt-8 right-1 top-16 opacity-0 bg-white transition delay-75 ease-in-out z-10"
          style={{ right: "3px" }}
        >
          <ul className="block text-center text-display-veryDarkGrayishBlue">
            <li style={{ minWidth: "16rem" }} className="py-4">
              <a
                className="hover:bg-display-yellow px-6 py-3 cursor-pointer             hover:text-black
                hover:font-text hover:uppercase hover:rounded-full "
              >
                About
              </a>
            </li>
            <li style={{ minWidth: "16rem" }} className="py-4">
              <a
                className="hover:bg-display-yellow px-6 py-3 cursor-pointer             hover:text-black
                hover:font-text hover:uppercase hover:rounded-full "
              >
                Services
              </a>
            </li>
            <li style={{ minWidth: "16rem" }} className="py-4">
              <a
                className="hover:bg-display-yellow px-6 py-3 cursor-pointer             hover:text-black
                hover:font-text hover:uppercase hover:rounded-full "
              >
                Projects
              </a>
            </li>
            <li style={{ minWidth: "16rem" }} className="py-4">
              <a
                className="hover:bg-display-yellow px-6 py-3 cursor-pointer             hover:text-black
                hover:font-text hover:uppercase hover:rounded-full "
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
