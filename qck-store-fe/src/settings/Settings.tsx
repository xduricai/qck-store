import { ChangeEvent, useState } from "react";
import { Input } from "../shared/Input";
import { User } from "../api/responses/User";
import { Button } from "../shared/Button";
import { PasswordDialog } from "./PasswordDialog";
import { Link } from "react-router-dom";
import { useSnackbarContext } from "../global/SnackbarContext";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../api/UserClient";
import { IconButton } from "../shared/IconButton";
import { DeleteOutline, Edit, ImageOutlined } from "@mui/icons-material";
import { UserUpdateCommand } from "../api/commands/UserUpdateCommand";
import "./settings.css";

export function Settings({ user, setUser }: { user: User, setUser: (user: User) => void }) { 
    const showSnackbar = useSnackbarContext();
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ profilePicture, setProfilePicture ] = useState(user.profilePicture);
    const [ email, setEmail ] = useState(user.email);
    const [ firstName, setFirstName ] = useState(user.firstName);
    const [ lastName, setLastName ] = useState(user.lastName);

    const [firstError, setFirstError] = useState<string | null>(null);
    const validateFirst = (name: string) => {
        setFirstError(name ? null : "Please enter a first name");
    }

    const [lastError, setLastError] = useState<string | null>(null);
    const validateLast = (name: string) => {
        setLastError(name ? null : "Please enter a last name");
    }

    const [ emailError, setEmailError ] = useState<string | null>(null);
    const validateEmail = (email: string) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }
        setEmailError(null);
    }

    const { mutate } = useMutation({
        mutationFn: updateUser,
        onSuccess: (res, variables) => {
            if (res.emailError) {
                setEmailError(res.emailError);
                showSnackbar("Could not update information, some fields are invalid", "error");
                return;
            }
            showSnackbar("Information updated successfully", "success");
            const updatedUser: User = {...user};
            
            if (variables.updateEmail) {
                updatedUser.email = res.email;
                setEmail(res.email);
            }
            if (variables.updatePicture) {
                updatedUser.profilePicture = profilePicture;
            }
            updatedUser.firstName = firstName;
            updatedUser.lastName = lastName;

            setUser(updatedUser);
        },
        onError: (err) => showSnackbar(err.toString(), "error")
    });

    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files?.length) return;
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result !== "string") return;
            setProfilePicture(reader.result)
        }
    }

    function revertChanges() {
        setEmail(user.email);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setProfilePicture(user.profilePicture);
        setEmailError("");
        setFirstError("");
        setLastError("");
    }

    function handleSubmit() {
        if (firstError || lastError || emailError) return;
        if (profilePicture === user.profilePicture && 
            email === user.email && 
            firstName === user.firstName && 
            lastName === user.lastName
        ) return;

        const req: UserUpdateCommand = { 
            updatePicture: profilePicture !== user.profilePicture,
            updateEmail: email !== user.email,
            firstName,
            lastName, 
            email
        };
        if (req.updatePicture) req.profilePicture = profilePicture;

        mutate(req);
    }

    return (
        <div className="h-[calc(100%-4rem)] max-w-[800px] mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-6">Settings</h1>
                <Link to="/">
                    <Button color="outlined">Home</Button>
                </Link>
            </div>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                <div className="profile-picture">
                        {profilePicture && <img src={profilePicture} className="picture" />}
                        {!profilePicture &&
                            <div className="placeholder bg-gray-100">
                                <ImageOutlined sx={{ width: 1/3, height: 1/3 }} className="placeholder-icon text-gray-800" />
                            </div>
                        }
                        <label htmlFor="image-upload" className="overlay hover:bg-gray-400/60">
                            <Edit sx={{ width: 1/4, height: 1/4 }} className="overlay-icon text-gray-800" />
                        </label>
                        <input onChange={handleUpload} className="hidden" type="file" id="image-upload" accept="image/*" />
                        {profilePicture && 
                            <div className="delete">
                                <IconButton className="bg-gray-100">
                                    <DeleteOutline onClick={() => setProfilePicture("")} fontSize="large" className="text-red-800" />
                                </IconButton>
                            </div>
                        }
                    </div>  
            </div>
            <section className="grid grid-cols-1 rounded p-[1px] bg-gray-800 gap-y-[1px]">
                <div className="settings-field rounded-t">
                    <span className="">Password</span>
                    <Button onClick={() => setDialogOpen(true)} color="outlined">Change Password</Button>
                </div>
                <div className="settings-field">
                    <span>Email</span>
                    <Input 
                        width="w-72"
                        type="text"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Email..."
                        validator={{error: emailError, validate: validateEmail}}
                        className="mt-5 focus:mt-[19px]"
                    />
                </div>
                <div className="settings-field">
                    <span>First Name</span>
                    <Input 
                        width="w-72"
                        type="text"
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        validator={{error: firstError, validate: validateFirst}}
                        placeholder="First Name..."
                        className="mt-5 focus:mt-[19px]"
                    />
                </div>
                <div className="settings-field">
                    <span>Last Name</span>
                    <Input 
                        width="w-72"
                        type="text"
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        validator={{error: lastError, validate: validateLast}}
                        placeholder="Last Name..."
                        className="mt-5 focus:mt-[19px]"
                    />
                </div>
                <div className="flex items-center h-[72px] bg-gray-300 rounded-b">
                    <Button onClick={revertChanges} color="outlined" className="ml-auto mr-4">Discard Changes</Button>
                    <Button onClick={handleSubmit} color="accent" className="mr-4">Save Changes</Button>
                </div>
            </section>
            <PasswordDialog userId={user.id} open={dialogOpen} setOpen={setDialogOpen} />
        </div>
    );
}