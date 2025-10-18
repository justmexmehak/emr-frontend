import { useState, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import type { Patient, PaginatedPatientsResponse } from "../services/patientsService";
import { fetchPatients } from "../services/patientsService";

const PAGE_SIZE = 10;

const PatientList = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [paginationResponse, setPaginationResponse] = useState<PaginatedPatientsResponse>();
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const loadPatients = async () => {
            const res = await fetchPatients(page, PAGE_SIZE);
            setPaginationResponse(res);
            setPatients(res.data);
        };
        loadPatients();
    }, [page]);

    const totalPages = paginationResponse?.pagination.totalPages ?? 1;

    return (
        <div style={{ padding: "20px" }}>
            {/* Patient Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {patients.map(patient => (
                    <div
                        key={patient.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            cursor: "pointer",
                            transition: "box-shadow 0.2s",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                            marginRight: "80px",
                            marginLeft: "80px"
                        }}
                        onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                        {/* Left Side: Gender Icon */}
                        <div style={{ marginRight: "16px" }}>
                            <FaCircleUser style={{ color:
                            patient.gender === "male"
                                ? "#b5c7eb"
                                : patient.gender === "female"
                                ? "#ffd1dc"
                                : "#cccccc", fontSize: "56px" }} />
                        </div>
                        {/* Right Side: Patient Info */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>{patient.name}</span>
                            <span style={{ fontSize: "0.9em", color: "#888", marginTop: "2px" }}>MR{String(patient.mrNumber).padStart(4, "0")}</span>
                            <span style={{ fontSize: "1em", marginTop: "4px" }}>Age: {patient.age}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Controls */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px" }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: page === 1 ? "not-allowed" : "pointer" }}
                >
                    Prev
                </button>
                <span style={{ alignSelf: "center" }}>Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #ccc", background: "#f5f5f5", cursor: page === totalPages ? "not-allowed" : "pointer" }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PatientList;