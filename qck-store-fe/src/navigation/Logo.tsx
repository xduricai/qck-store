import { Link } from "react-router-dom";

export function Logo() {
    return (
        <Link to="/" className="h-min mx-4 font-bold cursor-pointer text-xl">
            <span className="text-purple-800">QCK</span>
            <span className="text-black">STORE</span>
        </Link>
    )
}