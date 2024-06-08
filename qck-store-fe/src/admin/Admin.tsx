import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/AdminClient";
import { LoadingPage } from "../shared/Loading";
import { ErrorPage } from "../shared/ErrorPage";
import { UserCard } from "./UserCard";
import { Searchbar } from "../navigation/Searchbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../shared/IconButton";
import { Close } from "@mui/icons-material";

export function Admin() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers
    });
    const navigate = useNavigate();
    const { query } = useParams();
    const title = query ? `Results for "${query}"` : "Users";
    
    if (isLoading) return <LoadingPage />
    if (isError) return <ErrorPage />

    function search(query: string) {
        if (!query) return;
        navigate(`/${query}`);
    }
    
    //TODO add search and pagination
    return (
        <div className="h-[calc(100%-4rem)] max-w-[900px] px-12 mx-auto">
            <div className="flex items-center">
                <h1 className="text-xl font-semibold my-6 mr-1">{title}</h1>
                {query && 
                    <Link to="/">
                        <IconButton>
                            <Close className="text-purple-800"/>
                        </IconButton>
                    </Link>
                }
                <Searchbar className="ml-auto" onSubmit={search} />
            </div>
            <section className="flex flex-col gap-y-3">
                {data?.map(user => <UserCard key={user.id} user={user} /> )}
            </section>
        </div>          
    );
}