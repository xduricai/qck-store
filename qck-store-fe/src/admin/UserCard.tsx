import { User } from "../api/responses/User";

export function UserCard({ user }: { user: User }) {
    return (
        <div className="">
            {user.email}
        </div>
    );
}