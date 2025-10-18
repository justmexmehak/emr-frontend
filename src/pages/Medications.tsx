import { useEffect, useState } from "react";
import { fetchMedications, addMedication } from "../services/medicationsService";
import type { Medication } from "../services/medicationsService";

const Medications = () => {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [newMedName, setNewMedName] = useState("");
    const [loading, setLoading] = useState(false);

    const loadMedications = async () => {
        setLoading(true);
        const meds = await fetchMedications();
        console.log(meds);
        setMedications(meds);
        setLoading(false);
    };

    useEffect(() => {
        loadMedications();
    }, []);

    const handleAddMedication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMedName.trim()) return;
        const result = await addMedication(newMedName.trim());
        if (result.success) {
            setNewMedName("");
            loadMedications();
        } else {
            alert(result.message || "Could not add medication.");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "40px auto", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "32px 24px" }}>
            <h1>Medications</h1>
            <form onSubmit={handleAddMedication} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                <input
                    type="text"
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    placeholder="Medication Name"
                    style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                    required
                />
                <button
                    type="submit"
                    style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#7393B3", color: "#fff", cursor: "pointer" }}
                >
                    Add
                </button>
            </form>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul style={{ padding: 0, listStyle: "none" }}>
                    {medications.map(med => (
                        <li key={med.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                            {med.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Medications;