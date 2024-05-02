import { Searchbar } from "./Searchbar";
import { Logo } from "./Logo";
import { IconButton } from "../shared/IconButton";
import { useUserContext } from "../global/UserContext";
import { MouseEvent, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./navigation.css";
 
export function Navbar() {
    const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
    const userContext = useUserContext();
    
    function toggleMenu (event: MouseEvent) {
        event.stopPropagation();
        setMenuOpen(!menuOpen);
    }

    return (
        <nav onClick={() => setMenuOpen(false)} className="navbar items-center w-full align-items-center text-xl font-medium bg-gray-100 h-16">
            <Logo />
            {!!userContext.user &&
            <>
                <div className="ml-4">
                    <Searchbar />
                </div>
                
                <div className="mx-2 w-min">                  
                    <IconButton>
                        <AccountCircleIcon onClick={toggleMenu} fontSize="large" className="text-purple-800" />
                    </IconButton>
                </div>

                {menuOpen &&
                    <div className="absolute mx-2 top-14 right-1 w-28 rounded border-gray-400 border">
                        <span onClick={() => {}} className="menu-item text-base">
                            Settings
                        </span>
                        <span onClick={() => {}} className="menu-item text-base text-red-600 font-semibold">
                            Log Out
                        </span>
                    </div>
                }
            </>
            }
        </nav>
    )
}