import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const SearchBar = () => {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="search-bar-container">
            <div className="search-bar" style={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Patient Search"
                    className="search-input"
                    style={{
                        ...styles.searchInput,
                        ...(isFocused ? styles.searchInputFocus : {})
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <FaSearch style={styles.searchIcon} />
            </div>
            <div className="search-results">
                Search Results
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    searchBar: { border: "1px solid darkgray" },
    searchIcon: { color: "darkgray", padding: "2px" },
    searchInput: { border: "none" },
    searchInputFocus: {outline: "none" }
};

export default SearchBar;
