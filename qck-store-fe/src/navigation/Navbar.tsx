import "./navigation.css";
import { Searchbar } from "./Searchbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logo } from "./Logo";
import { IconButton } from "../shared/IconButton";
import { useUserContext } from "../global/UserContext";
 
export function Navbar() {
    const userContext = useUserContext();
    return (
        <nav className="navbar border-gray-400 border-b-[1.5px] items-center w-full align-items-center text-xl font-medium h-16">
            <Logo />
            {!!userContext.user &&
            <>
                <div className="ml-4">
                    <Searchbar />
                </div>
                
                <div className="flex flex-row mx-4 w-min">
                    <IconButton>
                        <SettingsIcon fontSize="large" className="text-purple-800" />
                    </IconButton>
                    
                    <IconButton>
                        <AccountCircleIcon fontSize="large" className="text-purple-800" />
                    </IconButton>
                </div>
            </>
            }
        </nav>
    )
}