import { Link } from "react-router-dom";
import { Directory } from "../api/responses/Directory";

type BreadcrumbProps = {
    path: string;
    folders: Directory[];
}

type BreadcrumbStep = {
    id: string;
    name: string;
}

export function Breadcrumb({ path, folders }: BreadcrumbProps) {
    const steps: BreadcrumbStep[] = path
        .slice(0, path.length - 1)
        .split("/")
        .map(id => ({ id, name: folders.find(f => f.id.toString() === id)?.name || "" }));
    const final = steps.pop();

    return (
        <div className="flex flex-wrap gap-x-2">
            <Link className="font-semibold hover:text-purple-700" to="/">Home</Link>
            {steps.map(step => (<>
                <span className="font-semibold">/</span>
                <Link className="font-semibold hover:text-purple-700" to={`/folder/${step.id}`} key={step.id}>
                    {step.name}
                </Link>
            </>))}
            <span className="font-semibold">/</span>
            <span className="font-bold text-purple-700">{final!.name}</span>
        </div>
    );
}