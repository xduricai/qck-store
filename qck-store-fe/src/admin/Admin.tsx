import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/AdminClient";
import { LoadingPage } from "../shared/Loading";
import { ErrorPage } from "../shared/ErrorPage";
import { UserCard } from "./UserCard";
import { Searchbar } from "../navigation/Searchbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconButton } from "../shared/IconButton";
import { Close, FirstPage, LastPage, NavigateBefore, NavigateNext } from "@mui/icons-material";

export function Admin() {
    const { query } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers
    });
    const [ page, setPage ] = useState<number>(1);
    const navigate = useNavigate();
    
    if (isLoading) return <LoadingPage />
    if (isError || !data) return <ErrorPage />

    const title = query ? `Results for "${query}"` : "Users";
    let content = [...data];

    if (query) {
        content = content.filter(user => (
            user.username.toLocaleLowerCase().includes(query) ||
            user.email.toLocaleLowerCase().includes(query) ||
            user.firstName.toLocaleLowerCase().includes(query) ||
            user.lastName.toLocaleLowerCase().includes(query)
        ));
    }
    const pageCount = Math.ceil(content.length / 10);
    if (page > pageCount) setPage(pageCount);
    content = content.slice((page - 1) * 10, page * 10)

    function search(query: string) {
        if (!query) return;
        navigate(`/search/${query.toLocaleLowerCase()}`);
    }
    
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
                {content.map(user => <UserCard key={user.id} user={user} /> )}
            </section>
            <div className="flex items-center border-t border-gray-400 mt-4 p-2">
                <p className="text-sm ml-auto mr-4 mt-0.5">
                    Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, data.length)} of {data.length}
                </p>
                <p className="flex">
                    <IconButton disabled={page === 1} onClick={() => setPage(1)}>
                        <FirstPage className={page === 1 ? "text-gray-400" : "text-gray-600"} />
                    </IconButton>
                    <IconButton disabled={page === 1} onClick={() => setPage(page - 1)}>
                        <NavigateBefore className={page === 1 ? "text-gray-400" : "text-gray-600"} />
                    </IconButton>
                    <IconButton disabled={page === pageCount} onClick={() => setPage(page + 1)}>
                        <NavigateNext className={page === pageCount ? "text-gray-400" : "text-gray-600"} />
                    </IconButton>
                    <IconButton disabled={page === pageCount} onClick={() => setPage(pageCount)}>
                        <LastPage className={page === pageCount ? "text-gray-400" : "text-gray-600"} />
                    </IconButton>
                </p>
            </div>
        </div>          
    );
}