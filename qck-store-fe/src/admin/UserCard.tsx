import { UserDetails } from "../api/responses/UserDetails";
import { Tracker } from "../navigation/Tracker";

export function UserCard({ user }: { user: UserDetails }) {
    return (
        <div className="flex gap-x-8 rounded-xl items-center border-gray-400 hover:border-gray-800 hover:bg-gray-100 border p-4">
            <p className="text-xl">
                <b>ID:</b> {user.id}
            </p>
            <p className="flex flex-col">
                <span>
                    <b>Username:</b> {user.username}
                </span>
                <span>
                    <b>Full Name:</b> {user.firstName} {user.lastName}
                </span>
            </p>
            <p className="flex flex-col">
                <span>
                    <b>Email:</b> {user.email}
                </span>
                <span>
                    <b>Account Created:</b> {user.created}
                </span>
            </p>
            <Tracker className="ml-auto" user={user} />
        </div>
    );
}