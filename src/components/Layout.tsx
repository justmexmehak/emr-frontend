import { useState } from "react";
import { FaBars, FaHome, FaUser, FaUserPlus } from "react-icons/fa";
import { FaKitMedical } from "react-icons/fa6";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Side Drawer */}
            <div
                style={{
                    width: drawerOpen ? 200 : 0,
                    transition: "width 0.3s",
                    background: "#e9eaed",
                    color: "#36454F",
                    overflow: "hidden",
                    padding: drawerOpen ? "20px" : "0",
                    margin: "20px"
                }}
            >
                <h3 style={{ marginBottom: "20px" }}>Menu</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <FaHome style={{ marginRight: "8px" }} />
                        <a href="/dashboard" style={{ color: "#36454F", textDecoration: "none" }}>Home</a>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <FaUser style={{ marginRight: "8px" }} />
                        <a href="/patients" style={{ color: "#36454F", textDecoration: "none" }}>Patients</a>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <FaUserPlus style={{ marginRight: "8px" }} />
                        <a href="/patient/add" style={{ color: "#36454F", textDecoration: "none" }}>Add New Patient</a>
                    </li>
                    <li style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                        <FaKitMedical style={{ marginRight: "8px" }} />
                        <a href="/medications" style={{ color: "#36454F", textDecoration: "none" }}>Medications</a>
                    </li>
                </ul>
            </div>
            {/* Main Content */}
            <div style={{ flex: 1, padding: "20px" }}>
                <FaBars
                    style={{ fontSize: 24, cursor: "pointer" }}
                    onClick={() => setDrawerOpen(!drawerOpen)}
                />
                {children}
            </div>
        </div>
    );
};

export default Layout;