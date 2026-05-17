import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    
    //filters
    const [search, setSearch] = useState("");
    const [minDuration, setMinDuration] = useState("");
    const [maxDuration, setMaxDuration] = useState("");
    const [isActive, setIsActive] = useState("");

    function buildQuery() {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", 10)

        if (search) params.append("search", search);
        if (minDuration) params.append("minDuration", minDuration);
        if (maxDuration) params.append("maxDuration", maxDuration);
        if (isActive) params.append("isActive", isActive);
        
        console.log(params);
        return `/movies?${params.toString()}`;
    }

    function handleSearch() {
        setPage(1);
        const url = buildQuery();
        console.log("im handle search");
        apiFetch(url)
            .then((res) => {
                console.log(res.data);
                setMovies(res.data);
                setMeta(res.meta);
            })
            .catch(console.error);
    }

    useEffect(() => {
        const url = buildQuery();

        apiFetch(url)
        .then((res) => {
            setMovies(res.data);
            setMeta(res.meta);
        })
        .catch((err) => {
            console.error(err);
        });
    }, [page]);

    return (
        <div>
            <h2>Movies</h2>

            <div style={{ marginBottom: "20px" }}>
                <input
                    placeholder="Search title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                /><br />

                <input
                    type="number"
                    placeholder="Min duration"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                /><br />

                <input
                    type="number"
                    placeholder="Max duration"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                /><br />

                <select
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select><br />

                <button onClick={handleSearch}>Search</button>
            </div>

            {movies.map((m) => (
                <div key={m.id}>
                    <h2>Title: {m.title}</h2>
                    <p>ID: {m.id}</p>
                    <p>Description: {m.description}</p>
                    <p>Duration: ({m.duration} min)</p>
                    <p>Active: {m.isActive}</p>
                </div>
            ))}

            <br />
            
            <p>Current Page: {page}</p>

            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                Prev
            </button>

            <button onClick={() => setPage(page + 1)} disabled={page >= meta.total_pages}>
                Next
            </button>
        </div>
    );
}

export default Movies;