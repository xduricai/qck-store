import { useNavigate } from "react-router-dom";
import { Button } from "../shared/Button";

export function Initial() {
    const navigate = useNavigate();
    const toLogin = () => navigate('/login');
    const toRegister = () => navigate('/register');
    
    return (
        <div className="flex gap-2 flex-col h-[calc(100vh-64px)] text-center justify-center items-center">
            <h2 className="text-xl text-purple-800 font-bold">QCK STORE</h2>
            <Button onClick={toRegister} className="w-[200px]" color="outlined">
                Create an Account
            </Button>
            <p>Already have an account?</p>
            <Button onClick={toLogin} className="w-[200px]" color="accent" >
                Sign In
            </Button>
        </div>
    );
}