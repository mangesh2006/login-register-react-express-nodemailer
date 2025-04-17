import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="py-2 bg-blue-600 flex justify-between items-center px-6">
        <Link to="/" className="font-bold text-white text-xl cursor-pointer">
          Logo
        </Link>

        <div className="flex gap-2">
          <Link
            className="p-3 bg-transparent border rounded-md text-white"
            to={"/login"}
          >
            Login
          </Link>
          <Link
            className="p-3 bg-transparent border rounded-md text-white"
            to={"/signup"}
          >
            Sign-up
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
