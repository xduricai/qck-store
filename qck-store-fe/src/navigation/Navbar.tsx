import "./navigation.css";
import { Searchbar } from "./Searchbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logo } from "./Logo";
import { IconButton } from "../shared/IconButton";
import { useUserContext } from "../UserContext";
 
export function Navbar(): JSX.Element {
    const userContext = useUserContext();
    
    return (
        <nav className="navbar shadow-lg shadow-zinc-600/30 items-center w-full align-items-center text-xl font-medium h-16 bg-violet-800">
            {/* <Link to={"/"}>Home</Link> */}
            <Logo />
            {!!userContext.user &&
            <>
                <div className="ml-4">
                    <Searchbar />
                </div>
                
                <div className="flex flex-row mx-4 w-min">
                    <IconButton>
                        <SettingsIcon fontSize="large" className="text-white" />
                    </IconButton>
                    
                    <IconButton>
                        <AccountCircleIcon fontSize="large" className="text-white" />
                    </IconButton>
                </div>
            </>
            }
        </nav>
    )
}