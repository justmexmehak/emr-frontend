import { useState } from "react";
import { FaPlus, FaPrint } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { addPatient } from "../services/patientsService";

const getToday = () => new Date().toISOString().slice(0, 10);

const AddPatient = () => {
    const [form, setForm] = useState({
        name: "",
        age: "",
        contact: "",
        gender: "",
        visitDate: getToday(),
        diagnosis: "",
        notes: "",
        prescription: [
            { name: "", dosage: "", frequency: "", duration: "" }
        ]
    });

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
            prescription: [...prev.prescription, { name: "", dosage: "", frequency: "", duration: "" }]
        }));
    };

    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Submit logic here (e.g., send to backend)
        const result = await addPatient(form);
        if (result.success) {
            alert("Patient added!")
        
        // alert("Patient added!");
            setForm({
                name: "",
                age: "",
                contact: "",
                gender: "",
                visitDate: getToday(),
                diagnosis: "",
                notes: "",
                prescription: [{ name: "", dosage: "", frequency: "", duration: "" }]
            });
        } else {
            alert("Error: " + (result.message || "Could not add patient."));
        }
    };

     const handlePrint = () => {
        const doc = new jsPDF();
        // const pageWidth = doc.internal.pageSize.getWidth();
        // const marginLeft = pageWidth / 2;
        // let y = 40;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);

        // doc.text("Patient Details", marginLeft, y);
        // y += 20;

        doc.text(`${form.name}`, 70, 45, { align: "center" });
        // y += 10;
        doc.text(`${form.age}`, 120, 45, { align: "center" });
        // y += 10;
        doc.text(`${form.visitDate}`, 165, 45, { align: "center" });
        // y += 10;
        // doc.text(`Gender: ${patient?.gender}`, marginLeft, y, { align: "center" });
        // y += 10;
        const maxWidth = 50;
        const diagnosisLines = doc.splitTextToSize(form.diagnosis, maxWidth);
        diagnosisLines.forEach((line, index) => {
            doc.text(line, 25, 75 + index * 10, { align: "center" });
        });
        // y += 10;

        if (form.prescription.length > 0 && form.prescription.some(med => med.name)) {
            // doc.text("Prescription:", marginLeft, y, { align: "center" });
            let y = 75;
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
    
        
    // const handlePrint = () => {
    //     const doc = new jsPDF();
    //     const pageWidth = doc.internal.pageSize.getWidth();
    //     const marginLeft = pageWidth / 2;
    //     let y = 40;

    //     doc.setFont("helvetica", "normal");
    //     doc.setFontSize(14);

    //     doc.text("Patient Details", marginLeft, y, { align: "center" });
    //     y += 20;
    //     doc.text(`Name: ${form.name}`, marginLeft, y, { align: "center" });
    //     y += 10;
    //     doc.text(`Age: ${form.age}`, marginLeft, y, { align: "center" });
    //     y += 10;
    //     doc.text(`Contact No: ${form.contact}`, marginLeft, y, { align: "center" });
    //     y += 10;
    //     doc.text(`Gender: ${form.gender}`, marginLeft, y, { align: "center" });
    //     y += 10;
    //     doc.text(`Date: ${form.date}`, marginLeft, y, { align: "center" });
    //     y += 10;
    //     const maxWidth = 50;
    //     const diagnosisLines = doc.splitTextToSize(form.diagnosis, maxWidth);
    //     diagnosisLines.forEach((line, index) => {
    //         doc.text(line, marginLeft, y + index * 10, { align: "center" });
    //     });
    //     y += 10;

    //     if (form.prescription.length > 0 && form.prescription.some(med => med.name)) {
    //         doc.text("Prescription:", marginLeft, y, { align: "center" });
    //         y += 10;
    //         form.prescription.forEach((med, idx) => {
    //             if (med.name) {
    //                 doc.text(
    //                     `${med.name} — ${med.dosage}, ${med.frequency}, ${med.duration}`,
    //                     marginLeft,
    //                     y,
    //                     { align: "center" }
    //                 );
    //                 y += 10;
    //             }
    //         });
    //     }
    //     window.open(doc.output("bloburl"), "_blank");
    // };

    return (
        <div style={{
            maxWidth: "700px",
            margin: "40px auto",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "32px 24px",
            position: "relative"
        }}>
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
            <form onSubmit={handleSubmit}>
                <h2 style={{ marginBottom: "24px" }}>Add New Patient</h2>
                <div style={{ marginBottom: "12px" }}>
                    <label>Patient Name:&nbsp;
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => handleFormChange("name", e.target.value)}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "60%" }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Age:&nbsp;
                        <input
                            type="number"
                            value={form.age}
                            onChange={e => handleFormChange("age", e.target.value)}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "30%" }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Contact Number:&nbsp;
                        <input
                            type="text"
                            value={form.contact}
                            onChange={e => handleFormChange("contact", e.target.value)}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "40%" }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Gender:&nbsp;
                        <select
                            value={form.gender}
                            onChange={e => handleFormChange("gender", e.target.value)}
                            style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "30%" }}
                            required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: "12px" }}>
                    <label>Date:&nbsp;
                        <input
                            type="date"
                            value={form.visitDate}
                            onChange={e => handleFormChange("visitDate", e.target.value)}
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
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                value={med.name}
                                onChange={e => handlePrescriptionChange(idx, "name", e.target.value)}
                                style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "20%" }}
                                required
                            />
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
                    Save Patient
                </button>
            </form>
        </div>
    );
};

export default AddPatient;