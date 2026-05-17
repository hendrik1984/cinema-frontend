import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";

function Movies() {
    function getInitialState() {
        const params = new URLSearchParams(window.location.search);

        return {
            page: parseInt(params.get("page")) || 1,
            search: params.get("search") || "",
            minDuration: params.get("minDuration") || "",
            maxDuration: params.get("maxDuration") || "",
            isActive: params.get("isActive") || "",
        };
    }

    const initial = getInitialState();

    const [movies, setMovies] = useState([]);
    const [meta, setMeta] = useState({});
    
    //filters
    const [page, setPage] = useState(initial.page);
    const [search, setSearch] = useState(initial.search);
    const [minDuration, setMinDuration] = useState(initial.minDuration);
    const [maxDuration, setMaxDuration] = useState(initial.maxDuration);
    const [isActive, setIsActive] = useState(initial.isActive);

    function buildQuery() {
        const params = new URLSearchParams();

        params.append("page", page);
        params.append("limit", 10)

        if (search) params.append("search", search);
        if (minDuration) params.append("minDuration", minDuration);
        if (maxDuration) params.append("maxDuration", maxDuration);
        if (isActive) params.append("isActive", isActive);
        
        return `/movies?${params.toString()}`;
    }

    // update url when state change
    useEffect(() => {
        const params = new URLSearchParams();

        params.set("page", page)
        
        if (search) params.set("search", search);
        if (minDuration) params.set("min_duration", minDuration);
        if (maxDuration) params.set("max_duration", maxDuration);
        if (isActive !== "") params.set("is_active", isActive);

        const newUrl = `/movies?${params.toString()}`;
        window.history.pushState({}, "", newUrl);
    }, [page, search, minDuration, maxDuration, isActive]);

    // fetch data when state changes
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
    }, [page, search, minDuration, maxDuration, isActive]);

    function handleSearch() {
        setPage(1);
    }

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