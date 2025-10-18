import { useState } from 'react';
import { jsPDF } from 'jspdf';

const PatientForm = () => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [gender, setGender] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [prescription, setPrescription] = useState("");

    const handlePrint = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginLeft = pageWidth / 2;
        let y = 40;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);

        doc.text("Patient Details", marginLeft, y);
        y += 20;

        doc.text(`Name: ${name}`, marginLeft, y);
        y += 10;
        doc.text(`Age: ${age}`, marginLeft, y);
        y += 10;
        doc.text(`Contact No: ${contactNo}`, marginLeft, y);
        y += 10;
        doc.text(`Gender: ${gender}`, marginLeft, y);
        y += 10;
        doc.text(`Diagnosis: ${diagnosis}`, marginLeft, y);
        y += 10;
        doc.text(`Prescription: ${prescription}`, marginLeft, y);
        y += 10;

        // doc.save(`patient-${name}-details.pdf`);
        window.open(doc.output("bloburl"), "_blank");
    };

    return (
        <div style={styles.container}>
            <h2>Patient Details Form</h2>
            <form style = {styles.form}>
                <label>Name: </label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <label>Age: </label>
                <input value={age} onChange={(e) => setAge(e.target.value)} />
                <label>ContactNo: </label>
                <input value={contactNo} onChange={(e) => setContactNo(e.target.value)} />
                <label>Gender: </label>
                <input value={gender} onChange={(e) => setGender(e.target.value)} />
                <label>Diagnosis: </label>
                <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                <label>Prescription: </label>
                <input value={prescription} onChange={(e) => setPrescription(e.target.value)} />

                <button type="button" onClick={handlePrint} style={styles.button}>
                    Print PDF
                </button>
            </form>
        </div>
    );

};

const styles: { [key: string]: React.CSSProperties } = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "#f5f5f5" },
    form: { display: "flex", flexDirection: "column", width: "400px", border: "1px solid #ccc", padding: "30px", borderRadius: "8px" },
    label: { marginBottom: "5px", marginTop: "10px" },
    input: { padding: "8px", marginBottom: "10px" },
    button: { padding: "10px", backgroundColor: "darkgray", color: "#fff", border: "none", cursor: "pointer" },  
    error: { color: "red", marginBottom: "10px" }
};

export default PatientForm;

