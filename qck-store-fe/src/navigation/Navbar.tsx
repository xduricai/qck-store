import { Searchbar } from "./Searchbar";
import { Logo } from "./Logo";
import { IconButton } from "../shared/IconButton";
import { useUserContext } from "../global/UserContext";
import { useSnackbarContext } from "../global/SnackbarContext";
import { MouseEvent, useState } from "react";
import { logout } from "../api/UserClient";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./navigation.css";
 
export function Navbar() {
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
    const { user, setUser } = useUserContext();
    const showSnackbar = useSnackbarContext();
    
    function toggleMenu (event: MouseEvent) {
        event.stopPropagation();
        setMenuOpen(!menuOpen);
    }

    async function logOut () {
        logout()
            .then(() => setUser(undefined))
            .catch((err) => showSnackbar(err.toString(), "error"));
    }

    return (
        <nav onClick={() => setMenuOpen(false)} className="navbar items-center w-full align-items-center text-xl font-medium bg-gray-100 h-16">
            <Logo />
            {!!user &&
            <>
                <div className="ml-4">
                    <Searchbar />
                </div>
                
                <div onClick={toggleMenu} className="flex items-center mx-2 w-max text-purple-800 cursor-pointer hover:bg-gray-300 rounded-3xl">      
                    <span className="w-max h-fit text-base font-semibold ml-4">
                        {`${user.firstName} ${user.lastName}`}
                    </span>            
                    {!user.profilePicture &&
                        <IconButton>
                            <AccountCircleIcon fontSize="large" />
                        </IconButton>
                    }
                    {user.profilePicture &&
                        <img src={user.profilePicture} className="picture size-10 m-[3px] ml-2" />
                    }
                </div>

                {menuOpen &&
                    <div className="absolute z-10 mx-2 top-14 right-1 w-28 rounded border-gray-400 border">
                        <Link to="settings" className="menu-item text-base">
                            Settings
                        </Link>
                        <span onClick={logOut} className="menu-item text-base text-red-600 font-semibold">
                            Log Out
                        </span>
                    </div>
                }
            </>
            }
        </nav>
    )
}