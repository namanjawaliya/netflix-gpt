import React, { useCallback, useEffect, useState } from "react";
import { APP_LOGO, USER_ICON } from "../utils/constants/constants";
import { auth } from "../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/store/userSlice";
import LanguageSelector from "./LanguageSelector";
import { toggleSideMenu } from "../utils/store/headerSlice";
import CloseIcon from "./Icons/CloseIcon";
import MenuIcon from "./Icons/MenuIcon";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isSideMenuOpen = useSelector((store) => store.header.isOpen);

  const user = useSelector((store) => store.user);
  const showGptSearch = location.pathname === "/suggest";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        if (location.pathname === "/") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [dispatch, location.pathname, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    dispatch(toggleSideMenu());
  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      if (isSideMenuOpen) toggleMenu();
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isSideMenuOpen) toggleMenu();
  };

  return (
    <div>
      <div
        className={`${
          isScrolled
            ? "fixed top-0 bg-black"
            : "absolute bg-gradient-to-b from-black"
        } w-screen px-8 py-2 z-50 h-18 flex justify-between items-center transition-transform ease-in-out duration-300`}
      >
        <img
          className="w-36 md:w-44 cursor-pointer"
          src={APP_LOGO}
          alt="Netflix Logo"
          onClick={() => handleNavigation("/")}
        />
        {user && (
          <div className="flex justify-center items-center">
            <div className="hidden lg:block flex gap-6">
              <img
                className="w-12 h-12 rounded"
                src={user?.photoURL || USER_ICON}
                alt="user icon"
              />
              {showGptSearch && <LanguageSelector />}
              <button
                className="text-white border w-36 border-red-500 rounded px-4 py-1 hover:bg-red-500"
                onClick={() => handleNavigation("/browse")}
              >
                Browse
              </button>
              <button
                className="text-white border w-36 border-red-500 rounded px-4 py-1 hover:bg-red-500"
                onClick={() => handleNavigation("/suggest")}
              >
                Suggest
              </button>
              <button
                className="text-white border border-red-500 rounded px-4 py-1 hover:bg-red-500"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
            <button onClick={toggleMenu} className="block lg:hidden p-0 m-0">
              <MenuIcon height={40} width={40} />
            </button>
          </div>
        )}
      </div>
      <div
        className={`fixed bg-black bg-opacity-95 right-0 z-50 transform transition-transform ease-in-out duration-300 ${
          isSideMenuOpen ? "translate-x-0" : "translate-x-[2000px]"
        } `}
      >
        <div className="flex justify-end px-8 py-8">
          <button onClick={toggleMenu}>
            <CloseIcon height={40} width={40} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 w-screen h-screen px-8 py-8">
          <img
            className="w-12 h-12 rounded"
            src={user?.photoURL || USER_ICON}
            alt="user icon"
          />
          {showGptSearch && <LanguageSelector />}
          <button
            className="text-white border border-red-500 rounded px-4 py-1 hover:bg-red-500 w-52"
            onClick={() => handleNavigation("/browse")}
          >
            Browse
          </button>
          <button
            className="text-white border border-red-500 rounded px-4 py-1 hover:bg-red-500 w-52"
            onClick={() => handleNavigation("/suggest")}
          >
            Suggest
          </button>
          <button
            className="text-white border border-red-500 rounded px-4 py-1 hover:bg-red-500 w-52"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
