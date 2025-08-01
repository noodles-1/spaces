import Link from "next/link";

export function PublicTopbar() {
    return (
        <Link 
            href="/login"
            className="m-6 bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-right text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-left"
        >
            spaces
        </Link>
    );
}