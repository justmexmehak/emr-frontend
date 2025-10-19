import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
// import PatientForm from './features/patients/PatientForm';
import SearchBar from './components/SearchBar';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';
import AddPatient from './pages/AddPatient';
import Medications from './pages/Medications';

function App() {
  return (
    <HashRouter basename={import.meta.env.BASE_URL || '/'}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patients" 
          element={
            <ProtectedRoute>
              <Layout>
                <PatientList />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/patient/add" 
          element={
            <ProtectedRoute>
              <Layout>
                <AddPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/medications" 
          element={
            <ProtectedRoute>
              <Layout>
                <Medications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/patient/search" element={<SearchBar />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
