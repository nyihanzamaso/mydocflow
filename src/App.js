import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { MantineProvider, createTheme } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/dropzone/styles.css"

// Pages
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import DocumentsPage from "./pages/DocumentsPage"
import DocumentDetailPage from "./pages/DocumentDetailPage"
import UploadDocumentPage from "./pages/UploadDocumentPage"
import PendingReviewPage from "./pages/PendingReviewPage"
import ApprovedDocumentsPage from "./pages/ApprovedDocumentsPage"
import RejectedDocumentsPage from "./pages/RejectedDocumentsPage"
import UserProfilePage from "./pages/UserProfilePage"

// Context
import { AuthProvider } from "./context/AuthContext"

// Layout
import MainLayout from "./components/layout/MainLayout"

// Theme configuration
const theme = createTheme({
  primaryColor: "teal",
  colors: {
    teal: [
      "#e6f7f4",
      "#c5ebe5",
      "#a3dfd6",
      "#82d3c7",
      "#60c7b8",
      "#3ebba9",
      "#1caf9a",
      "#169b88",
      "#108776",
      "#0a7364",
    ],
    brand: [
      "#e0f5ff",
      "#b8e6ff",
      "#8fd6ff",
      "#66c7ff",
      "#3db8ff",
      "#14a9ff",
      "#0099ff",
      "#0077cc",
      "#005599",
      "#003366",
    ],
  },
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 600,
  },
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "md",
      },
    },
  },
})

// Auth guard component
const ProtectedRoute = ({ children }) => {
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Notifications position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
                  <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="documents/:id" element={<DocumentDetailPage />} />
              <Route path="documents/upload" element={<UploadDocumentPage />} />
              <Route path="pending" element={<PendingReviewPage />} />
              <Route path="approved" element={<ApprovedDocumentsPage />} />
              <Route path="rejected" element={<RejectedDocumentsPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  )
}

export default App

