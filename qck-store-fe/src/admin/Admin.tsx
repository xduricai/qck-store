import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/AdminClient";
import { LoadingPage } from "../shared/Loading";
import { ErrorPage } from "../shared/ErrorPage";
import { UserCard } from "./UserCard";

export function Admin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers
    });
    
    if (isLoading) return <LoadingPage />
    if (isError) return <ErrorPage />
    
    return (
        <div className="h-[calc(100%-4rem)] max-w-[800px] px-12 mx-auto">
            <h1 className="text-xl font-semibold my-6">Users</h1>
            <section className="flex flex-col gap-y-3">
                {data?.map(user => <UserCard user={user} /> )}
            </section>
        </div>          
    );
}