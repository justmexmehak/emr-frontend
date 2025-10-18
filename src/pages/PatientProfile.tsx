import { useParams } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import { FaPlus, FaPrint } from "react-icons/fa";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { fetchPatientDetail, addVisitRecord } from "../services/patientsService";
import type { PatientDetail } from "../services/patientsService";
import { fetchMedications } from '../services/medicationsService';

const getToday = () => new Date().toISOString().slice(0, 10);

const PatientProfile = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState<PatientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [medicines, setMedicines] = useState<string[]>([]);
    const [showSuggestionsIdx, setShowSuggestionsIdx] = useState(-1);

    // Form state
    const [form, setForm] = useState({
        date: getToday(),
        diagnosis: "",
        notes: "",
        prescription: [
            { medication: { id: "", name: "" }, dosage: "", frequency: "", duration: "" }
        ]
    });



    useEffect(() => {

        console.log("Fetching patient with id: ", id);
        const loadPatient = async () => {
            setLoading(true);
            const res = await fetchPatientDetail(id as string);
            console.log(res);
            setPatient(res?.data ?? null);
            setLoading(false);
        };
        loadPatient();

        const loadMedicines = async () => {
            const meds = await fetchMedications();
            setMedicines(meds.map(m => m.name)); // assuming fetchMedicines returns array of {id, name}
        };
        loadMedicines();
    }, [id]);

    const handlePrescriptionChange = (idx: number, field: string, value: string) => {
        setForm(prev => ({
            ...prev,
            prescription: prev.prescription.map((med, i) =>
                i === idx ? { ...med, [field]: value } : med
            )
        }));
    };

    const addPrescriptionField = () => {
        setForm(prev => ({
            ...prev,
            prescription: [...prev.prescription, { medication: { id: "", name: "" }, dosage: "", frequency: "", duration: "" }]
        }));
    };

    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            visitDate: form.date,
            diagnosis: form.diagnosis,
            notes: form.notes,
            prescription: form.prescription.map(med => ({
                name: med.name || med.medication?.name || "",
                dosage: med.dosage,
                frequency: med.frequency,
                duration: med.duration
            }))
        };
        console.log("Payload being sent", payload);
        const result = await addVisitRecord(id, payload);
        if (result.success) {
            alert("Visit record added!");
            setShowForm(false);
            setForm({
                date: getToday(),
                diagnosis: "",
                notes: "",
                prescription: [{ medication: {id: "", name: ""}, dosage: "", frequency: "", duration: "" }]
            });
            window.location.reload();
        } else {
            alert(result.message || "Could not add visit record.");
        }
    };

    const handlePrint = () => {
        const doc = new jsPDF();
        // const pageWidth = doc.internal.pageSize.getWidth();
        // const marginLeft = pageWidth / 2;
        let y = 40;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);

        // doc.text("Patient Details", marginLeft, y);
        y += 20;

        doc.text(`${patient?.name}`, 70, 45, { align: "center" });
        y += 10;
        doc.text(`${patient?.age}`, 120, 45, { align: "center" });
        y += 10;
        doc.text(`${form.date}`, 165, 45, { align: "center" });
        y += 10;
        // doc.text(`Gender: ${patient?.gender}`, marginLeft, y, { align: "center" });
        y += 10;
        const maxWidth = 50;
        const diagnosisLines = doc.splitTextToSize(form.diagnosis, maxWidth);
        diagnosisLines.forEach((line, index) => {
            doc.text(line, 25, 75 + index * 10, { align: "center" });
        });
        y += 10;

        if (form.prescription.length > 0 && form.prescription.some(med => med.name)) {
            // doc.text("Prescription:", marginLeft, y, { align: "center" });
            y = 75;
            form.prescription.forEach((med, idx) => {
                if (med.name) {
                    doc.text(
                        `${med.name} — ${med.dosage} ${med.frequency} ${med.duration}`,
                        120,
                        y,
                        { align: "center" }
                    );
                    y += 10;
                }
            });
        }
        // doc.save(`patient-${name}-details.pdf`);
        window.open(doc.output("bloburl"), "_blank");
    };

    

    if (loading) return <div>Loading...</div>;
    if (!patient) return <div>Patient not found.</div>;

    console.log("Fetched patient with id: ", patient);

    return (
        <div style={{ display: "flex", height: "100vh", padding: "40px" }}>
            {/* Left: Patient Card */}
            <div style={{
                minWidth: "280px",
                maxWidth: "320px",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "32px 24px",
                marginRight: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <FaCircleUser
                    style={{
                        fontSize: "64px",
                        color:
                            patient.gender === "male"
                                ? "#b5c7eb"
                                : patient.gender === "female"
                                ? "#ffd1dc"
                                : "#cccccc"
                    }}
                />
                <h2 style={{ margin: "16px 0 4px 0" }}>{patient.name}</h2>
                <div style={{ color: "#888", fontSize: "0.95em", marginBottom: "8px" }}>MR{String(patient.mrNumber).padStart(4, "0")}</div>
                <div style={{ fontSize: "1em", marginBottom: "8px" }}>Age: {patient.age}</div>
                <div style={{ fontSize: "1em", marginBottom: "8px" }}>Contact: {patient.contact}</div>
                {patient.visits[0]?.diagnosis && (
                    <div style={{ fontSize: "1em", color: "#555", marginTop: "8px" }}>
                        Diagnosis: {patient.visits[0].diagnosis}
                    </div>
                )}
            </div>
            {/* Right: Visit Records */}
            <div style={{
                flex: 1,
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: "24px",
                overflowY: "auto",
                maxHeight: "calc(100vh - 80px)",
                position: "relative",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h3>Visit Records</h3>
                    <button
                        style={{
                            background: "#7393B3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 14px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "1em"
                        }}
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus style={{ marginRight: "6px" }} /> Add Visit Record
                    </button>
                </div>
                {showForm && (
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            onClick={handlePrint}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "none",
                                border: "none",
                                cursor: "pointer"
                            }}
                            title="Print Patient Details"
                        >
                            <FaPrint style={{ fontSize: "1.5em", color: "#7393B3" }} />
                        </button>
                    <form
                        onSubmit={handleSubmit}
                        // onSubmit={e => { e.preventDefault(); setShowForm(false); }}
                        style={{
                            background: "#f8f8f8",
                            borderRadius: "8px",
                            padding: "20px",
                            marginBottom: "24px",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                        }}
                    >
                        <div style={{ marginBottom: "12px" }}>
                            <label>Date:&nbsp;
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => handleFormChange("date", e.target.value)}
                                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                                />
                            </label>
                        </div> 
                        <div style={{ marginBottom: "12px" }}>
                            <label>Diagnosis:&nbsp;
                                <input
                                    type="text"
                                    value={form.diagnosis}
                                    onChange={e => handleFormChange("diagnosis", e.target.value)}
                                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "60%" }}
                                    required
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: "12px" }}>
                            <label>Notes:&nbsp;
                                <textarea
                                    value={form.notes}
                                    onChange={e => handleFormChange("notes", e.target.value)}
                                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "60%", minHeight: "40px" }}
                                    placeholder="Optional"
                                />
                            </label>
                        </div>
                        <div>
                            <strong>Prescription:</strong>
                            {form.prescription.map((med, idx) => (
    <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
        <div style={{ position: "relative", width: "20%" }}>
            <input
                type="text"
                placeholder="Medicine Name"
                value={med.name}
                onChange={e => handlePrescriptionChange(idx, "name", e.target.value)}
                style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                required
                autoComplete="off"
                onFocus={() => setShowSuggestionsIdx(idx)}
            />
            {/* Auto-complete dropdown */}
            {showSuggestionsIdx === idx && med.name && (
                <div style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 10,
                    maxHeight: "150px",
                    overflowY: "auto"
                }}>
                    {medicines
                        .filter(name => name.toLowerCase().includes(med.name.toLowerCase()))
                        .slice(0, 10)
                        .map((name, i) => (
                            <div
                                key={i}
                                onMouseDown={() => {
                                    handlePrescriptionChange(idx, "name", name);
                                    setShowSuggestionsIdx(-1);
                                }}
                                style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                {name}
                            </div>
                        ))}
                </div>
            )}
        </div>
                                    <input
                                        type="text"
                                        placeholder="Dosage"
                                        value={med.dosage}
                                        onChange={e => handlePrescriptionChange(idx, "dosage", e.target.value)}
                                        style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "15%" }}
    
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frequency"
                                        value={med.frequency}
                                        onChange={e => handlePrescriptionChange(idx, "frequency", e.target.value)}
                                        style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "15%" }}
                                        
                                    />
                                    <input
                                        type="text"
                                        placeholder="Duration"
                                        value={med.duration}
                                        onChange={e => handlePrescriptionChange(idx, "duration", e.target.value)}
                                        style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "15%" }}
                                        
                                    />
                                    {idx === form.prescription.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addPrescriptionField}
                                            style={{
                                                background: "#7393B3",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "32px",
                                                height: "32px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1.2em",
                                                cursor: "pointer"
                                            }}
                                            title="Add another medicine"
                                        >
                                            <FaPlus />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                                <button
                                    type="submit"
                                    style={{
                                        marginTop: "16px",
                                        background: "#7393B3",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "8px 18px",
                                        cursor: "pointer",
                                        fontSize: "1em"
                                    }}
                                >
                                    Save Visit Record
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        marginLeft: "12px",
                                        background: "#ccc",
                                        color: "#333",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "8px 18px",
                                        cursor: "pointer",
                                        fontSize: "1em"
                                    }}
                                >
                                    Cancel
                        </button>
                    </form>
                    </div>
                )}
                {patient.visits.length === 0 ? (
                    <div>No visit records found.</div>
                ) : (
                    patient.visits.map((visit) => (
                        <div
                            key={visit.id}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "16px",
                                marginBottom: "16px",
                                background: "#fafafa"
                            }}
                        >
                            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>{new Date(visit.visitDate).toLocaleDateString()}</div>
                            <div style={{ marginBottom: "4px" }}>Diagnosis: {visit.diagnosis}</div>
                            <div>
                                <strong>Prescription:</strong>
                                {visit.prescription.length === 0 ? (
                                    <div style={{ color: "#888", fontSize: "0.95em" }}>None</div>
                                ) : (
                                    <ul style={{ margin: "8px 0 0 0", paddingLeft: "18px" }}>
                                        {visit.prescription.map((med) => (
                                            <li key={med.id} style={{ marginBottom: "6px", listStyle: "none" }}>
                                                <span style={{ fontWeight: "bold" }}>{med.medication.name}</span>
                                                <span style={{ color: "#555" }}> — {med.dosage} {med.frequency} {med.duration}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {visit.notes && (
                                <div style={{ marginBottom: "4px", color: "#555" }}>
                                    <strong>Notes:</strong> {visit.notes}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientProfile;